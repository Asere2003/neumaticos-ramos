import { PrismaService } from '../prisma/prisma.service';
import { TipoBloqueo } from '@prisma/client';
export declare class CalendarioService {
    private prisma;
    constructor(prisma: PrismaService);
    obtenerDisponibilidadMes(anio: number, mes: number): Promise<{
        anio: number;
        mes: number;
        dias: Record<string, any>;
    }>;
    listarBloqueos(): Promise<{
        id: number;
        tipo: import("@prisma/client").$Enums.TipoBloqueo;
        createdAt: Date;
        updatedAt: Date;
        activo: boolean;
        fechaInicio: Date;
        fechaFin: Date;
        todoDia: boolean;
        motivo: string | null;
    }[]>;
    crearBloqueo(dto: {
        fechaInicio: string;
        fechaFin?: string;
        todoDia?: boolean;
        tipo: TipoBloqueo;
        motivo?: string;
    }): Promise<{
        id: number;
        tipo: import("@prisma/client").$Enums.TipoBloqueo;
        createdAt: Date;
        updatedAt: Date;
        activo: boolean;
        fechaInicio: Date;
        fechaFin: Date;
        todoDia: boolean;
        motivo: string | null;
    }>;
    eliminarBloqueo(id: number): Promise<{
        id: number;
        tipo: import("@prisma/client").$Enums.TipoBloqueo;
        createdAt: Date;
        updatedAt: Date;
        activo: boolean;
        fechaInicio: Date;
        fechaFin: Date;
        todoDia: boolean;
        motivo: string | null;
    }>;
}
