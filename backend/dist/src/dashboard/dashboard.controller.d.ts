import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
    resumen(): Promise<{
        fecha: string;
        stats: {
            citasHoy: number;
            pendientesHoy: number;
            confirmadas: number;
            citasSemana: number;
            clientesMes: number;
            totalClientes: number;
        };
        citasHoy: ({
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
        })[];
        bloqueosProximos: {
            id: number;
            tipo: import("@prisma/client").$Enums.TipoBloqueo;
            createdAt: Date;
            updatedAt: Date;
            activo: boolean;
            fechaInicio: Date;
            fechaFin: Date;
            todoDia: boolean;
            motivo: string | null;
        }[];
    }>;
}
