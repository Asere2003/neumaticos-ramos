import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConfiguracionService {

  constructor(private prisma: PrismaService) {}

  async obtenerPublico() {
    const config = await this.prisma.configuracionTaller.findUnique({ where: { id: 1 } });
    return {
      nombre:         config?.nombre,
      telefono:       config?.telefono,
      email:          config?.email,
      direccion:      config?.direccion,
      ciudad:         config?.ciudad,
      codigoPostal:   config?.codigoPostal,
      web:            config?.web,
      horarioSemanal: config?.horarioSemanal,
    };
  }

  async obtenerCompleta() {
    const [taller, notif] = await Promise.all([
      this.prisma.configuracionTaller.findUnique({ where: { id: 1 } }),
      this.prisma.configuracionNotificaciones.findUnique({ where: { id: 1 } }),
    ]);
    return { taller, notificaciones: notif };
  }

  async actualizarTaller(dto: any) {
    return this.prisma.configuracionTaller.update({ where: { id: 1 }, data: dto });
  }

  async actualizarNotificaciones(dto: any) {
    return this.prisma.configuracionNotificaciones.update({ where: { id: 1 }, data: dto });
  }
}