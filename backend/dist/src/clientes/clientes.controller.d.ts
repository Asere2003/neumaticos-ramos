import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
export declare class ClientesController {
    private service;
    constructor(service: ClientesService);
    crear(dto: CreateClienteDto): Promise<{
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
    }>;
    listar(busqueda?: string): Promise<({
        citas: ({
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
        })[];
        vehiculos: {
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
        }[];
        _count: {
            citas: number;
        };
    } & {
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
    })[]>;
    obtener(id: number): Promise<{
        citas: ({
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
        })[];
        vehiculos: {
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
        }[];
        _count: {
            citas: number;
        };
    } & {
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
    }>;
    eliminar(id: number): Promise<{
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
    }>;
}
