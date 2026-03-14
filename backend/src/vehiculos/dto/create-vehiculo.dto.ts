import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateVehiculoDto {

  @IsString()
  marca: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @Matches(/^\d{4}[A-Z]{3}$|^[A-Z]{1,2}\d{4}[A-Z]{2}$/, {
    message: 'Matrícula española no válida (ej: 1234ABC)'
  })
  matricula: string;

  @IsInt()
  @IsOptional()
  anio?: number;

  @IsString()
  @IsOptional()
  medidaNeumaticoDelantero?: string;

  @IsInt()
  clienteId: number;
}