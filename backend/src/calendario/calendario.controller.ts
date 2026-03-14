import {
  Controller, Get, Post, Delete,
  Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CalendarioService } from './calendario.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@ApiTags('Calendario')
@Controller('calendario')
export class CalendarioController {

  constructor(private readonly service: CalendarioService) {}

  @Get('disponibilidad')
  disponibilidad(
    @Query('anio') anio: number,
    @Query('mes')  mes:  number,
  ) {
    return this.service.obtenerDisponibilidadMes(anio, mes);
  }

  @Get('bloqueos')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  listar() {
    return this.service.listarBloqueos();
  }

  @Post('bloqueos')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  crear(@Body() dto: any) {
    return this.service.crearBloqueo(dto);
  }

  @Delete('bloqueos/:id')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.service.eliminarBloqueo(id);
  }
}