import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { EstadoCita } from '@prisma/client';
export declare class CitasController {
    private service;
    constructor(service: CitasService);
    slots(fecha: string, tipoServicio: string): Promise<{
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
    hoy(): Promise<({
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
    listar(estado?: EstadoCita, fecha?: string, clienteId?: number, busqueda?: string): Promise<({
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
    cambiarEstado(id: number, body: {
        estado: EstadoCita;
        motivo?: string;
        precioFinal?: number;
    }): Promise<{
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
