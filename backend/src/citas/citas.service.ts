import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCitaDto } from './dto/create-cita.dto';
import { EmailService } from 'src/mail/mail.service';
import { EstadoCita } from '@prisma/client';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class CitasService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificaciones: NotificacionesService,
    private readonly email: EmailService,
  ) { }

  async crear(dto: CreateCitaDto) {
    const fecha = dayjs(dto.fecha);

    const cliente = await this.prisma.cliente.findFirst({
      where: { id: dto.clienteId, eliminado: false },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    const vehiculo = await this.prisma.vehiculo.findFirst({
      where: { id: dto.vehiculoId, clienteId: dto.clienteId },
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

    const servicio = await this.prisma.servicio.findFirst({
      where: { tipo: dto.tipoServicio, activo: true },
    });
    if (!servicio) throw new NotFoundException('Servicio no disponible');

    const bloqueada = await this.prisma.bloqueoCalendario.findFirst({
      where: {
        activo: true,
        fechaInicio: { lte: fecha.toDate() },
        fechaFin: { gte: fecha.toDate() },
      },
    });
    if (bloqueada) {
      throw new BadRequestException(
        `El taller está cerrado: ${bloqueada.motivo}`
      );
    }

    const config = await this.prisma.configuracionTaller.findUnique({ where: { id: 1 } });
    const fechaFin = fecha.add(servicio.duracionMin, 'minute');

    const citasSolapadas = await this.prisma.cita.count({
      where: {
        estado: { notIn: [EstadoCita.CANCELADA, EstadoCita.NO_SHOW] },
        fecha: { lt: fechaFin.toDate() },
        fechaFin: { gt: fecha.toDate() },
      },
    });

    if (citasSolapadas >= (config?.maxCitasPorSlot ?? 1)) {
      throw new ConflictException('Ese horario ya no está disponible');
    }

    const cita = await this.prisma.cita.create({
      data: {
        fecha: fecha.toDate(),
        fechaFin: fechaFin.toDate(),
        clienteId: dto.clienteId,
        vehiculoId: dto.vehiculoId,
        servicioId: servicio.id,
        notasCliente: dto.notasCliente,
        estado: EstadoCita.PENDIENTE,
      },
      include: {
        cliente: true,
        vehiculo: true,
        servicio: true,
      },
    });

    await this.prisma.historialCita.create({
      data: {
        citaId: cita.id,
        estadoAnterior: EstadoCita.PENDIENTE,
        estadoNuevo: EstadoCita.PENDIENTE,
        cambiadoPor: 'CLIENTE',
        motivo: 'Cita creada online',
      },
    });

    await this.notificaciones.enviarConfirmacionCita(cita);
    
    
  // Email de recepcion al cliente
  if (cita.cliente.email) {
    await this.email.enviarRecepcionCita({
      nombre:    cita.cliente.nombre,
      email:     cita.cliente.email,
      fecha:     dayjs(cita.fecha).format('DD/MM/YYYY'),
      hora:      dayjs(cita.fecha).format('HH:mm'),
      servicio:  cita.servicio.nombre,
      matricula: cita.vehiculo.matricula,
    });
  }

    return cita;
  }

  async obtenerSlotsDisponibles(fecha: string, tipoServicio: string) {
    const dia = dayjs(fecha);

    const bloqueada = await this.prisma.bloqueoCalendario.findFirst({
      where: {
        activo: true,
        todoDia: true,
        fechaInicio: { lte: dia.endOf('day').toDate() },
        fechaFin: { gte: dia.startOf('day').toDate() },
      },
    });
    if (bloqueada) return { disponible: false, motivo: bloqueada.motivo, slots: [] };

    const [config, servicio] = await Promise.all([
      this.prisma.configuracionTaller.findUnique({ where: { id: 1 } }),
      this.prisma.servicio.findFirst({ where: { tipo: tipoServicio as any, activo: true } }),
    ]);

    if (!config || !servicio) return { disponible: false, slots: [] };

    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const diaNombre = diasSemana[dia.day()];
    const horario = (config.horarioSemanal as any)[diaNombre];

    if (!horario) return { disponible: false, motivo: 'Cerrado', slots: [] };

    const slots: string[] = [];
    const franjas = [horario.manana, horario.tarde].filter(Boolean);

    for (const [inicio, fin] of franjas) {
      let current = dayjs(`${fecha}T${inicio}`);
      const end = dayjs(`${fecha}T${fin}`);
      while (current.isBefore(end)) {
        slots.push(current.format('HH:mm'));
        current = current.add(config.intervaloMinutos, 'minute');
      }
    }

    const citasDelDia = await this.prisma.cita.findMany({
      where: {
        estado: { notIn: [EstadoCita.CANCELADA, EstadoCita.NO_SHOW] },
        fecha: {
          gte: dia.startOf('day').toDate(),
          lte: dia.endOf('day').toDate(),
        },
      },
      select: { fecha: true, fechaFin: true },
    });

    const slotsDisponibles = slots.filter(slot => {
      const slotInicio = dayjs(`${fecha}T${slot}`);
      const slotFin = slotInicio.add(servicio.duracionMin, 'minute');
      return !citasDelDia.some(cita => {
        const citaInicio = dayjs(cita.fecha);
        const citaFin = dayjs(cita.fechaFin);
        return slotInicio.isBefore(citaFin) && slotFin.isAfter(citaInicio);
      });
    });

    return { disponible: true, fecha: dia.format('DD/MM/YYYY'), slots: slotsDisponibles };
  }

  async listar(filtros: {
    estado?: EstadoCita;
    fecha?: string;
    clienteId?: number;
    busqueda?: string;
  }) {
    const where: any = {};
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.clienteId) where.clienteId = filtros.clienteId;
    if (filtros.fecha) {
      const dia = dayjs(filtros.fecha);
      where.fecha = {
        gte: dia.startOf('day').toDate(),
        lte: dia.endOf('day').toDate(),
      };
    }
    if (filtros.busqueda) {
      where.OR = [
        { cliente: { nombre: { contains: filtros.busqueda, mode: 'insensitive' } } },
        { cliente: { telefono: { contains: filtros.busqueda } } },
        { vehiculo: { matricula: { contains: filtros.busqueda.toUpperCase() } } },
      ];
    }
    return this.prisma.cita.findMany({
      where,
      include: { cliente: true, vehiculo: true, servicio: true },
      orderBy: { fecha: 'asc' },
    });
  }

  async cambiarEstado(
    id: number,
    nuevoEstado: EstadoCita,
    motivo?: string,
    precioFinal?: number,
  ) {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: { cliente: true, vehiculo: true, servicio: true },
    });
    if (!cita) throw new NotFoundException('Cita no encontrada');

    const citaActualizada = await this.prisma.cita.update({
      where: { id },
      data: {
        estado: nuevoEstado,
        notasTaller: motivo,
        ...(precioFinal && { precioFinal }),
      },
      include: { cliente: true, vehiculo: true, servicio: true },
    });

    await this.prisma.historialCita.create({
      data: {
        citaId: id,
        estadoAnterior: cita.estado,
        estadoNuevo: nuevoEstado,
        motivo,
        cambiadoPor: 'ADMIN',
      },
    });

    if (nuevoEstado === EstadoCita.CONFIRMADA) {
      await this.notificaciones.enviarConfirmacionCita(citaActualizada);
      if (citaActualizada.cliente.email) {
        await this.email.enviarConfirmacionCita({
          nombre: citaActualizada.cliente.nombre,
          email: citaActualizada.cliente.email,
          fecha: dayjs(citaActualizada.fecha).format('DD/MM/YYYY'),
          hora: dayjs(citaActualizada.fecha).format('HH:mm'),
          servicio: citaActualizada.servicio.nombre,
          matricula: citaActualizada.vehiculo.matricula,
        });
      }
    }
    if (nuevoEstado === EstadoCita.CANCELADA) {
      await this.notificaciones.enviarCancelacionCita(citaActualizada);
    }

    return citaActualizada;
  }

  async obtenerCitasHoy() {
    const hoy = dayjs();
    return this.prisma.cita.findMany({
      where: {
        fecha: {
          gte: hoy.startOf('day').toDate(),
          lte: hoy.endOf('day').toDate(),
        },
      },
      include: { cliente: true, vehiculo: true, servicio: true },
      orderBy: { fecha: 'asc' },
    });
  }

  async obtener(id: number) {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: { cliente: true, vehiculo: true, servicio: true },
    });
    if (!cita) throw new NotFoundException('Cita no encontrada');
    return cita;
  }
}