import {
  Controller, Get, Post, Body,
  Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { SupabaseGuard } from '../auth/supabase.guard';

@ApiTags('Vehículos')
@Controller('vehiculos')
export class VehiculosController {

  constructor(private service: VehiculosService) {}

  @Post()
  crear(@Body() dto: CreateVehiculoDto) {
    return this.service.crear(dto);
  }

  @Get('cliente/:clienteId')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  listarPorCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.service.listarPorCliente(clienteId);
  }

  @Get(':id')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.service.obtener(id);
  }
}