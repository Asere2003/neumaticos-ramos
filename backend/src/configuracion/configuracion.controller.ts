import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConfiguracionService } from './configuracion.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@ApiTags('Configuración')
@Controller('configuracion')
export class ConfiguracionController {

  constructor(private service: ConfiguracionService) {}

  @Get()
  publico() {
    return this.service.obtenerPublico();
  }

  @Get('admin')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  completa() {
    return this.service.obtenerCompleta();
  }

  @Patch('taller')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  actualizarTaller(@Body() dto: any) {
    return this.service.actualizarTaller(dto);
  }

  @Patch('notificaciones')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  actualizarNotificaciones(@Body() dto: any) {
    return this.service.actualizarNotificaciones(dto);
  }
}