import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

import { TipoServicio } from '@prisma/client';

export class CreateCitaDto {

  @IsDateString()
  fecha: string;

  @IsEnum(TipoServicio)
  tipoServicio: TipoServicio;

  @IsInt()
  clienteId: number;

  @IsInt()
  vehiculoId: number;

  @IsString()
  @IsOptional()
  notasCliente?: string;
}