import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClienteDto {

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre: string;

  @IsString()
  @Matches(/^[6789]\d{8}$/, {
    message: 'Teléfono español no válido (ej: 612345678)'
  })
  telefono: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  aceptaTerminos: boolean;

  @IsBoolean()
  @IsOptional()
  aceptaMarketing?: boolean;
}