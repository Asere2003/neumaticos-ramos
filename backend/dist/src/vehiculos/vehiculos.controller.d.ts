import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
export declare class VehiculosController {
    private service;
    constructor(service: VehiculosService);
    crear(dto: CreateVehiculoDto): Promise<{
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
    }>;
    listarPorCliente(clienteId: number): Promise<{
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
    }[]>;
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
    } & {
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
    }>;
}
