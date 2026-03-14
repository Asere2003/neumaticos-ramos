"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dayjs_1 = __importDefault(require("dayjs"));
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async obtenerResumen() {
        const hoy = (0, dayjs_1.default)();
        const inicioHoy = hoy.startOf('day').toDate();
        const finHoy = hoy.endOf('day').toDate();
        const inicioSem = hoy.startOf('week').toDate();
        const inicioMes = hoy.startOf('month').toDate();
        const [citasHoy, pendientesHoy, citasSemana, clientesMes, totalClientes, bloqueosProximos] = await Promise.all([
            this.prisma.cita.findMany({
                where: { fecha: { gte: inicioHoy, lte: finHoy } },
                include: { cliente: true, vehiculo: true, servicio: true },
                orderBy: { fecha: 'asc' },
            }),
            this.prisma.cita.count({
                where: { fecha: { gte: inicioHoy, lte: finHoy }, estado: client_1.EstadoCita.PENDIENTE },
            }),
            this.prisma.cita.count({
                where: { fecha: { gte: inicioSem, lte: finHoy }, estado: { notIn: [client_1.EstadoCita.CANCELADA, client_1.EstadoCita.NO_SHOW] } },
            }),
            this.prisma.cliente.count({
                where: { eliminado: false, createdAt: { gte: inicioMes } },
            }),
            this.prisma.cliente.count({ where: { eliminado: false } }),
            this.prisma.bloqueoCalendario.findMany({
                where: { activo: true, fechaInicio: { gte: hoy.toDate() } },
                orderBy: { fechaInicio: 'asc' },
                take: 5,
            }),
        ]);
        return {
            fecha: hoy.format('DD/MM/YYYY'),
            stats: {
                citasHoy: citasHoy.length,
                pendientesHoy,
                confirmadas: citasHoy.filter(c => c.estado === client_1.EstadoCita.CONFIRMADA).length,
                citasSemana,
                clientesMes,
                totalClientes,
            },
            citasHoy,
            bloqueosProximos,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map