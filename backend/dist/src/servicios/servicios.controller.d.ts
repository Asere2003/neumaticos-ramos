import { ServiciosService } from './servicios.service';
export declare class ServiciosController {
    private readonly service;
    constructor(service: ServiciosService);
    listar(): Promise<{
        id: number;
        tipo: import("@prisma/client").$Enums.TipoServicio;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        descripcion: string;
        precioDesde: number | null;
        duracionMin: number;
        activo: boolean;
    }[]>;
    actualizar(id: number, dto: any): Promise<{
        id: number;
        tipo: import("@prisma/client").$Enums.TipoServicio;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        descripcion: string;
        precioDesde: number | null;
        duracionMin: number;
        activo: boolean;
    }>;
}
