import { ConfiguracionService } from './configuracion.service';
export declare class ConfiguracionController {
    private service;
    constructor(service: ConfiguracionService);
    publico(): Promise<{
        nombre: string | undefined;
        telefono: string | undefined;
        email: string | undefined;
        direccion: string | undefined;
        ciudad: string | undefined;
        codigoPostal: string | undefined;
        web: string | undefined;
        horarioSemanal: import("@prisma/client/runtime/client").JsonValue | undefined;
    }>;
    completa(): Promise<{
        taller: {
            id: number;
            updatedAt: Date;
            nombre: string;
            telefono: string;
            email: string;
            direccion: string;
            ciudad: string;
            codigoPostal: string;
            web: string;
            horarioSemanal: import("@prisma/client/runtime/client").JsonValue;
            intervaloMinutos: number;
            maxCitasPorSlot: number;
            whatsappActivo: boolean;
            emailActivo: boolean;
            whatsappTaller: string;
            whatsappAdmin: string;
        } | null;
        notificaciones: {
            id: number;
            updatedAt: Date;
            confirmacionCita: boolean;
            recordatorio24h: boolean;
            recordatorio2h: boolean;
            cancelacionCita: boolean;
            nuevaCitaAdmin: boolean;
            resumenDiarioAdmin: boolean;
            cancelacionAdmin: boolean;
            plantillaConfirmacion: string;
            plantillaRecordatorio: string;
            plantillaCancelacion: string;
        } | null;
    }>;
    actualizarTaller(dto: any): Promise<{
        id: number;
        updatedAt: Date;
        nombre: string;
        telefono: string;
        email: string;
        direccion: string;
        ciudad: string;
        codigoPostal: string;
        web: string;
        horarioSemanal: import("@prisma/client/runtime/client").JsonValue;
        intervaloMinutos: number;
        maxCitasPorSlot: number;
        whatsappActivo: boolean;
        emailActivo: boolean;
        whatsappTaller: string;
        whatsappAdmin: string;
    }>;
    actualizarNotificaciones(dto: any): Promise<{
        id: number;
        updatedAt: Date;
        confirmacionCita: boolean;
        recordatorio24h: boolean;
        recordatorio2h: boolean;
        cancelacionCita: boolean;
        nuevaCitaAdmin: boolean;
        resumenDiarioAdmin: boolean;
        cancelacionAdmin: boolean;
        plantillaConfirmacion: string;
        plantillaRecordatorio: string;
        plantillaCancelacion: string;
    }>;
}
