import { CalendarioService } from './calendario.service';
export declare class CalendarioController {
    private readonly service;
    constructor(service: CalendarioService);
    disponibilidad(anio: number, mes: number): Promise<{
        anio: number;
        mes: number;
        dias: Record<string, any>;
    }>;
    listar(): Promise<{
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
    crear(dto: any): Promise<{
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
    eliminar(id: number): Promise<{
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
