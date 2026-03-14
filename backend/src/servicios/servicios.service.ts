import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiciosService {

  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.servicio.findMany({
      where:   { activo: true },
      orderBy: { id: 'asc' },
    });
  }

  async actualizar(id: number, dto: {
    nombre?:      string;
    descripcion?: string;
    precioDesde?: number;
    duracionMin?: number;
    activo?:      boolean;
  }) {
    const servicio = await this.prisma.servicio.findUnique({ where: { id } });
    if (!servicio) throw new NotFoundException('Servicio no encontrado');

    return this.prisma.servicio.update({
      where: { id },
      data:  dto,
    });
  }
}