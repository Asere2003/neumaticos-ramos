import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateClienteDto } from './dto/create-cliente.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientesService {

  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateClienteDto) {
    if (!dto.aceptaTerminos) {
      throw new BadRequestException(
        'Debes aceptar los términos y la política de privacidad'
      );
    }

    const existe = await this.prisma.cliente.findUnique({
      where: { telefono: dto.telefono },
    });
    if (existe && !existe.eliminado) return existe;

    return this.prisma.cliente.create({
      data: {
        nombre:              dto.nombre,
        telefono:            dto.telefono,
        email:               dto.email,
        aceptaTerminos:      dto.aceptaTerminos,
        aceptaMarketing:     dto.aceptaMarketing ?? false,
        fechaConsentimiento: new Date(),
      },
    });
  }

  async listar(busqueda?: string) {
    const where: any = { eliminado: false };

    if (busqueda) {
      where.OR = [
        { nombre:   { contains: busqueda, mode: 'insensitive' } },
        { telefono: { contains: busqueda } },
        { email:    { contains: busqueda, mode: 'insensitive' } },
        { vehiculos: { some: { matricula: { contains: busqueda.toUpperCase() } } } },
      ];
    }

    return this.prisma.cliente.findMany({
      where,
      include: {
        vehiculos: true,
        citas: {
          orderBy: { fecha: 'desc' },
          take:    5,
          include: { servicio: true },
        },
        _count: { select: { citas: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtener(id: number) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { id, eliminado: false },
      include: {
        vehiculos: true,
        citas: {
          orderBy: { fecha: 'desc' },
          include: { servicio: true, vehiculo: true },
        },
        _count: { select: { citas: true } },
      },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async eliminar(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    return this.prisma.cliente.update({
      where: { id },
      data: {
        eliminado:     true,
        eliminadoAt:   new Date(),
        nombre:        'ELIMINADO (RGPD)',
        telefono:      `ELIMINADO_${id}`,
        email:         null,
        notasInternas: null,
      },
    });
  }
}