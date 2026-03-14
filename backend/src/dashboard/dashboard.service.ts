import { EstadoCita } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class DashboardService {

  constructor(private prisma: PrismaService) {}

  async obtenerResumen() {
    const hoy       = dayjs();
    const inicioHoy = hoy.startOf('day').toDate();
    const finHoy    = hoy.endOf('day').toDate();
    const inicioSem = hoy.startOf('week').toDate();
    const inicioMes = hoy.startOf('month').toDate();

    const [citasHoy, pendientesHoy, citasSemana, clientesMes, totalClientes, bloqueosProximos] =
      await Promise.all([
        this.prisma.cita.findMany({
          where:   { fecha: { gte: inicioHoy, lte: finHoy } },
          include: { cliente: true, vehiculo: true, servicio: true },
          orderBy: { fecha: 'asc' },
        }),
        this.prisma.cita.count({
          where: { fecha: { gte: inicioHoy, lte: finHoy }, estado: EstadoCita.PENDIENTE },
        }),
        this.prisma.cita.count({
          where: { fecha: { gte: inicioSem, lte: finHoy }, estado: { notIn: [EstadoCita.CANCELADA, EstadoCita.NO_SHOW] } },
        }),
        this.prisma.cliente.count({
          where: { eliminado: false, createdAt: { gte: inicioMes } },
        }),
        this.prisma.cliente.count({ where: { eliminado: false } }),
        this.prisma.bloqueoCalendario.findMany({
          where:   { activo: true, fechaInicio: { gte: hoy.toDate() } },
          orderBy: { fechaInicio: 'asc' },
          take:    5,
        }),
      ]);

    return {
      fecha: hoy.format('DD/MM/YYYY'),
      stats: {
        citasHoy:      citasHoy.length,
        pendientesHoy,
        confirmadas:   citasHoy.filter(c => c.estado === EstadoCita.CONFIRMADA).length,
        citasSemana,
        clientesMes,
        totalClientes,
      },
      citasHoy,
      bloqueosProximos,
    };
  }
}