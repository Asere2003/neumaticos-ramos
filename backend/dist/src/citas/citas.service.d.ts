import { CreateCitaDto } from './dto/create-cita.dto';
import { EmailService } from 'src/mail/mail.service';
import { EstadoCita } from '@prisma/client';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class CitasService {
    private readonly prisma;
    private readonly notificaciones;
    private readonly email;
    constructor(prisma: PrismaService, notificaciones: NotificacionesService, email: EmailService);
    crear(dto: CreateCitaDto): Promise<{
        servicio: {
            id: number;
            tipo: import("@prisma/client").$Enums.TipoServicio;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            descripcion: string;
            precioDesde: number | null;
            duracionMin: number;
            activo: boolean;
        };
        cliente: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            telefono: string;
            email: string | null;
            aceptaTerminos: boolean;
            aceptaMarketing: boolean;
            fechaConsentimiento: Date | null;
            eliminado: boolean;
            eliminadoAt: Date | null;
            notasInternas: string | null;
        };
        vehiculo: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            anio: number | null;
            clienteId: number;
            marca: string;
            modelo: string | null;
            matricula: string;
            medidaNeumaticoDelantero: string | null;
            medidaNeumaticoTrasero: string | null;
            notasTecnicas: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fechaFin: Date | null;
        fecha: Date;
        clienteId: number;
        vehiculoId: number;
        notasCliente: string | null;
        estado: import("@prisma/client").$Enums.EstadoCita;
        notasTaller: string | null;
        precioFinal: number | null;
        servicioId: number;
    }>;
    obtenerSlotsDisponibles(fecha: string, tipoServicio: string): Promise<{
        disponible: boolean;
        motivo: string | null;
        slots: never[];
        fecha?: undefined;
    } | {
        disponible: boolean;
        slots: never[];
        motivo?: undefined;
        fecha?: undefined;
    } | {
        disponible: boolean;
        fecha: string;
        slots: string[];
        motivo?: undefined;
    }>;
    listar(filtros: {
        estado?: EstadoCita;
        fecha?: string;
        clienteId?: number;
        busqueda?: string;
    }): Promise<({
        servicio: {
            id: number;
            tipo: import("@prisma/client").$Enums.TipoServicio;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            descripcion: string;
            precioDesde: number | null;
            duracionMin: number;
            activo: boolean;
        };
        cliente: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            telefono: string;
            email: string | null;
            aceptaTerminos: boolean;
            aceptaMarketing: boolean;
            fechaConsentimiento: Date | null;
            eliminado: boolean;
            eliminadoAt: Date | null;
            notasInternas: string | null;
        };
        vehiculo: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            anio: number | null;
            clienteId: number;
            marca: string;
            modelo: string | null;
            matricula: string;
            medidaNeumaticoDelantero: string | null;
            medidaNeumaticoTrasero: string | null;
            notasTecnicas: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fechaFin: Date | null;
        fecha: Date;
        clienteId: number;
        vehiculoId: number;
        notasCliente: string | null;
        estado: import("@prisma/client").$Enums.EstadoCita;
        notasTaller: string | null;
        precioFinal: number | null;
        servicioId: number;
    })[]>;
    cambiarEstado(id: number, nuevoEstado: EstadoCita, motivo?: string, precioFinal?: number): Promise<{
        servicio: {
            id: number;
            tipo: import("@prisma/client").$Enums.TipoServicio;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            descripcion: string;
            precioDesde: number | null;
            duracionMin: number;
            activo: boolean;
        };
        cliente: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            telefono: string;
            email: string | null;
            aceptaTerminos: boolean;
            aceptaMarketing: boolean;
            fechaConsentimiento: Date | null;
            eliminado: boolean;
            eliminadoAt: Date | null;
            notasInternas: string | null;
        };
        vehiculo: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            anio: number | null;
            clienteId: number;
            marca: string;
            modelo: string | null;
            matricula: string;
            medidaNeumaticoDelantero: string | null;
            medidaNeumaticoTrasero: string | null;
            notasTecnicas: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fechaFin: Date | null;
        fecha: Date;
        clienteId: number;
        vehiculoId: number;
        notasCliente: string | null;
        estado: import("@prisma/client").$Enums.EstadoCita;
        notasTaller: string | null;
        precioFinal: number | null;
        servicioId: number;
    }>;
    obtenerCitasHoy(): Promise<({
        servicio: {
            id: number;
            tipo: import("@prisma/client").$Enums.TipoServicio;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            descripcion: string;
            precioDesde: number | null;
            duracionMin: number;
            activo: boolean;
        };
        cliente: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            telefono: string;
            email: string | null;
            aceptaTerminos: boolean;
            aceptaMarketing: boolean;
            fechaConsentimiento: Date | null;
            eliminado: boolean;
            eliminadoAt: Date | null;
            notasInternas: string | null;
        };
        vehiculo: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            anio: number | null;
            clienteId: number;
            marca: string;
            modelo: string | null;
            matricula: string;
            medidaNeumaticoDelantero: string | null;
            medidaNeumaticoTrasero: string | null;
            notasTecnicas: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fechaFin: Date | null;
        fecha: Date;
        clienteId: number;
        vehiculoId: number;
        notasCliente: string | null;
        estado: import("@prisma/client").$Enums.EstadoCita;
        notasTaller: string | null;
        precioFinal: number | null;
        servicioId: number;
    })[]>;
    obtener(id: number): Promise<{
        servicio: {
            id: number;
            tipo: import("@prisma/client").$Enums.TipoServicio;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            descripcion: string;
            precioDesde: number | null;
            duracionMin: number;
            activo: boolean;
        };
        cliente: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            telefono: string;
            email: string | null;
            aceptaTerminos: boolean;
            aceptaMarketing: boolean;
            fechaConsentimiento: Date | null;
            eliminado: boolean;
            eliminadoAt: Date | null;
            notasInternas: string | null;
        };
        vehiculo: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            anio: number | null;
            clienteId: number;
            marca: string;
            modelo: string | null;
            matricula: string;
            medidaNeumaticoDelantero: string | null;
            medidaNeumaticoTrasero: string | null;
            notasTecnicas: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fechaFin: Date | null;
        fecha: Date;
        clienteId: number;
        vehiculoId: number;
        notasCliente: string | null;
        estado: import("@prisma/client").$Enums.EstadoCita;
        notasTaller: string | null;
        precioFinal: number | null;
        servicioId: number;
    }>;
}
