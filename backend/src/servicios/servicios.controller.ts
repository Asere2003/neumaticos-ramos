import {
  Controller, Get, Patch, Body,
  Param, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ServiciosService } from './servicios.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@ApiTags('Servicios')
@Controller('servicios')
export class ServiciosController {

  constructor(private readonly service: ServiciosService) {}

  @Get()
  listar() {
    return this.service.listar();
  }

  @Patch(':id')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    return this.service.actualizar(id, dto);
  }
}