import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { TipoBloqueo } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class CalendarioService {

  constructor(private prisma: PrismaService) {}

  async obtenerDisponibilidadMes(anio: number, mes: number) {
    const inicio = dayjs(`${anio}-${mes}-01`).startOf('month');
    const fin    = inicio.endOf('month');

    const [bloqueos, config] = await Promise.all([
      this.prisma.bloqueoCalendario.findMany({
        where: {
          activo:      true,
          fechaInicio: { lte: fin.toDate() },
          fechaFin:    { gte: inicio.toDate() },
        },
      }),
      this.prisma.configuracionTaller.findUnique({ where: { id: 1 } }),
    ]);

    const dias: Record<string, any> = {};
    let current = inicio;

    while (current.isBefore(fin) || current.isSame(fin, 'day')) {
      const fechaStr   = current.format('YYYY-MM-DD');
      const diasSemana = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
      const diaNombre  = diasSemana[current.day()];
      const horario    = config ? (config.horarioSemanal as any)[diaNombre] : null;
      const bloqueado  = bloqueos.some(b =>
        current.toDate() >= b.fechaInicio && current.toDate() <= b.fechaFin
      );

      dias[fechaStr] = {
        disponible: !bloqueado && !!horario,
        bloqueado,
        cerrado: !horario,
      };

      current = current.add(1, 'day');
    }

    return { anio, mes, dias };
  }

  async listarBloqueos() {
    return this.prisma.bloqueoCalendario.findMany({
      where:   { activo: true },
      orderBy: { fechaInicio: 'asc' },
    });
  }

  async crearBloqueo(dto: {
    fechaInicio: string;
    fechaFin?:   string;
    todoDia?:    boolean;
    tipo:        TipoBloqueo;
    motivo?:     string;
  }) {
    const inicio = dayjs(dto.fechaInicio);
    const fin    = dto.fechaFin
      ? dayjs(dto.fechaFin).endOf('day')
      : inicio.endOf('day');

    return this.prisma.bloqueoCalendario.create({
      data: {
        fechaInicio: inicio.toDate(),
        fechaFin:    fin.toDate(),
        todoDia:     dto.todoDia ?? true,
        tipo:        dto.tipo,
        motivo:      dto.motivo,
        activo:      true,
      },
    });
  }

  async eliminarBloqueo(id: number) {
    const bloqueo = await this.prisma.bloqueoCalendario.findUnique({ where: { id } });
    if (!bloqueo) throw new NotFoundException('Bloqueo no encontrado');
    return this.prisma.bloqueoCalendario.update({
      where: { id },
      data:  { activo: false },
    });
  }
}