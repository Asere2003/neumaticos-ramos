import { PrismaService } from '../prisma/prisma.service';
export declare class ServiciosService {
    private prisma;
    constructor(prisma: PrismaService);
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
    actualizar(id: number, dto: {
        nombre?: string;
        descripcion?: string;
        precioDesde?: number;
        duracionMin?: number;
        activo?: boolean;
    }): Promise<{
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
