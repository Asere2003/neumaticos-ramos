import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehiculosService {

  constructor(private prisma: PrismaService) {}

  async crear(dto: CreateVehiculoDto) {
    const existe = await this.prisma.vehiculo.findUnique({
      where: { matricula: dto.matricula.toUpperCase() },
    });

    if (existe) {
      if (existe.clienteId === dto.clienteId) return existe;
      throw new ConflictException('Matrícula ya registrada');
    }

    return this.prisma.vehiculo.create({
      data: {
        marca:                    dto.marca,
        modelo:                   dto.modelo,
        matricula:                dto.matricula.toUpperCase(),
        anio:                     dto.anio,
        medidaNeumaticoDelantero: dto.medidaNeumaticoDelantero,
        clienteId:                dto.clienteId,
      },
    });
  }

  async listarPorCliente(clienteId: number) {
    return this.prisma.vehiculo.findMany({
      where: { clienteId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtener(id: number) {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { id },
      include: {
        citas: {
          orderBy: { fecha: 'desc' },
          take: 5,
          include: { servicio: true },
        },
      },
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    return vehiculo;
  }
}