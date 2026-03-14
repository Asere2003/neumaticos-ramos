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
var NotificacionesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionesService = void 0;
require("dayjs/locale/es");
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const dayjs_1 = __importDefault(require("dayjs"));
dayjs_1.default.locale('es');
let NotificacionesService = NotificacionesService_1 = class NotificacionesService {
    prisma;
    config;
    logger = new common_1.Logger(NotificacionesService_1.name);
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    interpolar(plantilla, vars) {
        return Object.entries(vars).reduce((text, [key, val]) => text.replaceAll(`[${key}]`, val), plantilla);
    }
    async enviarWhatsApp(telefono, mensaje) {
        try {
            this.logger.log(`📱 WhatsApp → +34${telefono}:\n${mensaje}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error enviando WhatsApp a ${telefono}:`, error);
            return false;
        }
    }
    async enviarConfirmacionCita(cita) {
        const config = await this.prisma.configuracionNotificaciones.findUnique({
            where: { id: 1 },
        });
        if (!config?.confirmacionCita)
            return;
        const mensaje = this.interpolar(config.plantillaConfirmacion, {
            NOMBRE: cita.cliente.nombre.split(' ')[0],
            FECHA: (0, dayjs_1.default)(cita.fecha).format('dddd D [de] MMMM'),
            HORA: (0, dayjs_1.default)(cita.fecha).format('HH:mm'),
            SERVICIO: cita.servicio.nombre,
            MATRICULA: cita.vehiculo.matricula,
        });
        const enviado = await this.enviarWhatsApp(cita.cliente.telefono, mensaje);
        await this.prisma.notificacionEnviada.create({
            data: {
                tipo: client_1.TipoNotificacion.CONFIRMACION_CITA,
                canal: client_1.CanalNotificacion.WHATSAPP,
                clienteId: cita.clienteId,
                citaId: cita.id,
                enviado,
                enviadoAt: enviado ? new Date() : null,
            },
        });
    }
    async notificarNuevaCitaAdmin(cita) {
        const [config, taller] = await Promise.all([
            this.prisma.configuracionNotificaciones.findUnique({ where: { id: 1 } }),
            this.prisma.configuracionTaller.findUnique({ where: { id: 1 } }),
        ]);
        if (!config?.nuevaCitaAdmin || !taller?.whatsappAdmin)
            return;
        const mensaje = `🔔 *Nueva cita recibida*\n\n` +
            `👤 ${cita.cliente.nombre}\n` +
            `📞 ${cita.cliente.telefono}\n` +
            `📅 ${(0, dayjs_1.default)(cita.fecha).format('dddd D [de] MMMM [a las] HH:mm')}\n` +
            `🔧 ${cita.servicio.nombre}\n` +
            `🚗 ${cita.vehiculo.marca} ${cita.vehiculo.modelo ?? ''} · ${cita.vehiculo.matricula}`;
        await this.enviarWhatsApp(taller.whatsappAdmin, mensaje);
    }
    async enviarCancelacionCita(cita) {
        const config = await this.prisma.configuracionNotificaciones.findUnique({
            where: { id: 1 },
        });
        if (!config?.cancelacionCita)
            return;
        const mensaje = this.interpolar(config.plantillaCancelacion, {
            NOMBRE: cita.cliente.nombre.split(' ')[0],
            FECHA: (0, dayjs_1.default)(cita.fecha).format('dddd D [de] MMMM'),
            HORA: (0, dayjs_1.default)(cita.fecha).format('HH:mm'),
        });
        const enviado = await this.enviarWhatsApp(cita.cliente.telefono, mensaje);
        await this.prisma.notificacionEnviada.create({
            data: {
                tipo: client_1.TipoNotificacion.CANCELACION_CITA,
                canal: client_1.CanalNotificacion.WHATSAPP,
                clienteId: cita.clienteId,
                citaId: cita.id,
                enviado,
                enviadoAt: enviado ? new Date() : null,
            },
        });
    }
};
exports.NotificacionesService = NotificacionesService;
exports.NotificacionesService = NotificacionesService = NotificacionesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], NotificacionesService);
//# sourceMappingURL=notificaciones.service.js.map