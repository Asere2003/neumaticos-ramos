import {
  Controller, Get, Post, Patch, Body,
  Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { SupabaseGuard } from '../auth/supabase.guard';
import { EstadoCita } from '@prisma/client';

@ApiTags('Citas')
@Controller('citas')
export class CitasController {

  constructor(private service: CitasService) {}

  // 1. PRIMERO las rutas específicas
  @Get('slots')
  slots(
    @Query('fecha')        fecha:        string,
    @Query('tipoServicio') tipoServicio: string,
  ) {
    return this.service.obtenerSlotsDisponibles(fecha, tipoServicio);
  }

  @Get('hoy')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  hoy() {
    return this.service.obtenerCitasHoy();
  }

  // 2. DESPUÉS la ruta genérica con parámetro
  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.service.obtener(id);
  }

  @Post()
  crear(@Body() dto: CreateCitaDto) {
    return this.service.crear(dto);
  }

  @Get()
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  listar(
    @Query('estado')    estado?:    EstadoCita,
    @Query('fecha')     fecha?:     string,
    @Query('clienteId') clienteId?: number,
    @Query('busqueda')  busqueda?:  string,
  ) {
    return this.service.listar({ estado, fecha, clienteId, busqueda });
  }

  @Patch(':id/estado')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      estado:       EstadoCita;
      motivo?:      string;
      precioFinal?: number;
    },
  ) {
    return this.service.cambiarEstado(id, body.estado, body.motivo, body.precioFinal);
  }
}