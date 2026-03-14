import { TipoServicio } from '@prisma/client';
export declare class CreateCitaDto {
    fecha: string;
    tipoServicio: TipoServicio;
    clienteId: number;
    vehiculoId: number;
    notasCliente?: string;
}
