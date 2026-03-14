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
exports.CalendarioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dayjs_1 = __importDefault(require("dayjs"));
let CalendarioService = class CalendarioService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async obtenerDisponibilidadMes(anio, mes) {
        const inicio = (0, dayjs_1.default)(`${anio}-${mes}-01`).startOf('month');
        const fin = inicio.endOf('month');
        const [bloqueos, config] = await Promise.all([
            this.prisma.bloqueoCalendario.findMany({
                where: {
                    activo: true,
                    fechaInicio: { lte: fin.toDate() },
                    fechaFin: { gte: inicio.toDate() },
                },
            }),
            this.prisma.configuracionTaller.findUnique({ where: { id: 1 } }),
        ]);
        const dias = {};
        let current = inicio;
        while (current.isBefore(fin) || current.isSame(fin, 'day')) {
            const fechaStr = current.format('YYYY-MM-DD');
            const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            const diaNombre = diasSemana[current.day()];
            const horario = config ? config.horarioSemanal[diaNombre] : null;
            const bloqueado = bloqueos.some(b => current.toDate() >= b.fechaInicio && current.toDate() <= b.fechaFin);
            dias[fechaStr] = {
                disponible: !bloqueado && !!horario,
                bloqueado,
                cerrado: !horario,
            };
            current = current.add(1, 'day');
        }
        return { anio, mes, dias };
    }
    async listarBloqueos() {
        return this.prisma.bloqueoCalendario.findMany({
            where: { activo: true },
            orderBy: { fechaInicio: 'asc' },
        });
    }
    async crearBloqueo(dto) {
        const inicio = (0, dayjs_1.default)(dto.fechaInicio);
        const fin = dto.fechaFin
            ? (0, dayjs_1.default)(dto.fechaFin).endOf('day')
            : inicio.endOf('day');
        return this.prisma.bloqueoCalendario.create({
            data: {
                fechaInicio: inicio.toDate(),
                fechaFin: fin.toDate(),
                todoDia: dto.todoDia ?? true,
                tipo: dto.tipo,
                motivo: dto.motivo,
                activo: true,
            },
        });
    }
    async eliminarBloqueo(id) {
        const bloqueo = await this.prisma.bloqueoCalendario.findUnique({ where: { id } });
        if (!bloqueo)
            throw new common_1.NotFoundException('Bloqueo no encontrado');
        return this.prisma.bloqueoCalendario.update({
            where: { id },
            data: { activo: false },
        });
    }
};
exports.CalendarioService = CalendarioService;
exports.CalendarioService = CalendarioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendarioService);
//# sourceMappingURL=calendario.service.js.map