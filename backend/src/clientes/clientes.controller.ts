import {
  Controller, Get, Post, Delete, Param, Body,
  Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { SupabaseGuard } from '../auth/supabase.guard';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {

  constructor(private service: ClientesService) {}

  @Post()
  crear(@Body() dto: CreateClienteDto) {
    return this.service.crear(dto);
  }

  @Get()
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  listar(@Query('busqueda') busqueda?: string) {
    return this.service.listar(busqueda);
  }

  @Get(':id')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.service.obtener(id);
  }

  @Delete(':id')
  @UseGuards(SupabaseGuard)
  @ApiBearerAuth()
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.service.eliminar(id);
  }
}