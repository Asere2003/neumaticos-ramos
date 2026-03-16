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
exports.CitasService = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../mail/mail.service");
const client_1 = require("@prisma/client");
const notificaciones_service_1 = require("../notificaciones/notificaciones.service");
const prisma_service_1 = require("../prisma/prisma.service");
const dayjs_1 = __importDefault(require("dayjs"));
let CitasService = class CitasService {
    prisma;
    notificaciones;
    email;
    constructor(prisma, notificaciones, email) {
        this.prisma = prisma;
        this.notificaciones = notificaciones;
        this.email = email;
    }
    async crear(dto) {
        const fecha = (0, dayjs_1.default)(dto.fecha);
        const cliente = await this.prisma.cliente.findFirst({
            where: { id: dto.clienteId, eliminado: false },
        });
        if (!cliente)
            throw new common_1.NotFoundException('Cliente no encontrado');
        const vehiculo = await this.prisma.vehiculo.findFirst({
            where: { id: dto.vehiculoId, clienteId: dto.clienteId },
        });
        if (!vehiculo)
            throw new common_1.NotFoundException('Vehículo no encontrado');
        const servicio = await this.prisma.servicio.findFirst({
            where: { tipo: dto.tipoServicio, activo: true },
        });
        if (!servicio)
            throw new common_1.NotFoundException('Servicio no disponible');
        const bloqueada = await this.prisma.bloqueoCalendario.findFirst({
            where: {
                activo: true,
                fechaInicio: { lte: fecha.toDate() },
                fechaFin: { gte: fecha.toDate() },
            },
        });
        if (bloqueada) {
            throw new common_1.BadRequestException(`El taller está cerrado: ${bloqueada.motivo}`);
        }
        const config = await this.prisma.configuracionTaller.findUnique({ where: { id: 1 } });
        const fechaFin = fecha.add(servicio.duracionMin, 'minute');
        const citasSolapadas = await this.prisma.cita.count({
            where: {
                estado: { notIn: [client_1.EstadoCita.CANCELADA, client_1.EstadoCita.NO_SHOW] },
                fecha: { lt: fechaFin.toDate() },
                fechaFin: { gt: fecha.toDate() },
            },
        });
        if (citasSolapadas >= (config?.maxCitasPorSlot ?? 1)) {
            throw new common_1.ConflictException('Ese horario ya no está disponible');
        }
        const cita = await this.prisma.cita.create({
            data: {
                fecha: fecha.toDate(),
                fechaFin: fechaFin.toDate(),
                clienteId: dto.clienteId,
                vehiculoId: dto.vehiculoId,
                servicioId: servicio.id,
                notasCliente: dto.notasCliente,
                estado: client_1.EstadoCita.PENDIENTE,
            },
            include: {
                cliente: true,
                vehiculo: true,
                servicio: true,
            },
        });
        await this.prisma.historialCita.create({
            data: {
                citaId: cita.id,
                estadoAnterior: client_1.EstadoCita.PENDIENTE,
                estadoNuevo: client_1.EstadoCita.PENDIENTE,
                cambiadoPor: 'CLIENTE',
                motivo: 'Cita creada online',
            },
        });
        await this.notificaciones.enviarConfirmacionCita(cita);
        if (cita.cliente.email) {
            await this.email.enviarRecepcionCita({
                nombre: cita.cliente.nombre,
                email: cita.cliente.email,
                fecha: (0, dayjs_1.default)(cita.fecha).format('DD/MM/YYYY'),
                hora: (0, dayjs_1.default)(cita.fecha).format('HH:mm'),
                servicio: cita.servicio.nombre,
                matricula: cita.vehiculo.matricula,
            });
        }
        return cita;
    }
    async obtenerSlotsDisponibles(fecha, tipoServicio) {
        const dia = (0, dayjs_1.default)(fecha);
        const bloqueada = await this.prisma.bloqueoCalendario.findFirst({
            where: {
                activo: true,
                todoDia: true,
                fechaInicio: { lte: dia.endOf('day').toDate() },
                fechaFin: { gte: dia.startOf('day').toDate() },
            },
        });
        if (bloqueada)
            return { disponible: false, motivo: bloqueada.motivo, slots: [] };
        const [config, servicio] = await Promise.all([
            this.prisma.configuracionTaller.findUnique({ where: { id: 1 } }),
            this.prisma.servicio.findFirst({ where: { tipo: tipoServicio, activo: true } }),
        ]);
        if (!config || !servicio)
            return { disponible: false, slots: [] };
        const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const diaNombre = diasSemana[dia.day()];
        const horario = config.horarioSemanal[diaNombre];
        if (!horario)
            return { disponible: false, motivo: 'Cerrado', slots: [] };
        const slots = [];
        const franjas = [horario.manana, horario.tarde].filter(Boolean);
        for (const [inicio, fin] of franjas) {
            let current = (0, dayjs_1.default)(`${fecha}T${inicio}`);
            const end = (0, dayjs_1.default)(`${fecha}T${fin}`);
            while (current.isBefore(end)) {
                slots.push(current.format('HH:mm'));
                current = current.add(config.intervaloMinutos, 'minute');
            }
        }
        const citasDelDia = await this.prisma.cita.findMany({
            where: {
                estado: { notIn: [client_1.EstadoCita.CANCELADA, client_1.EstadoCita.NO_SHOW] },
                fecha: {
                    gte: dia.startOf('day').toDate(),
                    lte: dia.endOf('day').toDate(),
                },
            },
            select: { fecha: true, fechaFin: true },
        });
        const slotsDisponibles = slots.filter(slot => {
            const slotInicio = (0, dayjs_1.default)(`${fecha}T${slot}`);
            const slotFin = slotInicio.add(servicio.duracionMin, 'minute');
            return !citasDelDia.some(cita => {
                const citaInicio = (0, dayjs_1.default)(cita.fecha);
                const citaFin = (0, dayjs_1.default)(cita.fechaFin);
                return slotInicio.isBefore(citaFin) && slotFin.isAfter(citaInicio);
            });
        });
        return { disponible: true, fecha: dia.format('DD/MM/YYYY'), slots: slotsDisponibles };
    }
    async listar(filtros) {
        const where = {};
        if (filtros.estado)
            where.estado = filtros.estado;
        if (filtros.clienteId)
            where.clienteId = filtros.clienteId;
        if (filtros.fecha) {
            const dia = (0, dayjs_1.default)(filtros.fecha);
            where.fecha = {
                gte: dia.startOf('day').toDate(),
                lte: dia.endOf('day').toDate(),
            };
        }
        if (filtros.busqueda) {
            where.OR = [
                { cliente: { nombre: { contains: filtros.busqueda, mode: 'insensitive' } } },
                { cliente: { telefono: { contains: filtros.busqueda } } },
                { vehiculo: { matricula: { contains: filtros.busqueda.toUpperCase() } } },
            ];
        }
        return this.prisma.cita.findMany({
            where,
            include: { cliente: true, vehiculo: true, servicio: true },
            orderBy: { fecha: 'asc' },
        });
    }
    async cambiarEstado(id, nuevoEstado, motivo, precioFinal) {
        const cita = await this.prisma.cita.findUnique({
            where: { id },
            include: { cliente: true, vehiculo: true, servicio: true },
        });
        if (!cita)
            throw new common_1.NotFoundException('Cita no encontrada');
        const citaActualizada = await this.prisma.cita.update({
            where: { id },
            data: {
                estado: nuevoEstado,
                notasTaller: motivo,
                ...(precioFinal && { precioFinal }),
            },
            include: { cliente: true, vehiculo: true, servicio: true },
        });
        await this.prisma.historialCita.create({
            data: {
                citaId: id,
                estadoAnterior: cita.estado,
                estadoNuevo: nuevoEstado,
                motivo,
                cambiadoPor: 'ADMIN',
            },
        });
        if (nuevoEstado === client_1.EstadoCita.CONFIRMADA) {
            await this.notificaciones.enviarConfirmacionCita(citaActualizada);
            if (citaActualizada.cliente.email) {
                await this.email.enviarConfirmacionCita({
                    nombre: citaActualizada.cliente.nombre,
                    email: citaActualizada.cliente.email,
                    fecha: (0, dayjs_1.default)(citaActualizada.fecha).format('DD/MM/YYYY'),
                    hora: (0, dayjs_1.default)(citaActualizada.fecha).format('HH:mm'),
                    servicio: citaActualizada.servicio.nombre,
                    matricula: citaActualizada.vehiculo.matricula,
                });
            }
        }
        if (nuevoEstado === client_1.EstadoCita.CANCELADA) {
            await this.notificaciones.enviarCancelacionCita(citaActualizada);
        }
        return citaActualizada;
    }
    async obtenerCitasHoy() {
        const hoy = (0, dayjs_1.default)();
        return this.prisma.cita.findMany({
            where: {
                fecha: {
                    gte: hoy.startOf('day').toDate(),
                    lte: hoy.endOf('day').toDate(),
                },
            },
            include: { cliente: true, vehiculo: true, servicio: true },
            orderBy: { fecha: 'asc' },
        });
    }
    async obtener(id) {
        const cita = await this.prisma.cita.findUnique({
            where: { id },
            include: { cliente: true, vehiculo: true, servicio: true },
        });
        if (!cita)
            throw new common_1.NotFoundException('Cita no encontrada');
        return cita;
    }
};
exports.CitasService = CitasService;
exports.CitasService = CitasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notificaciones_service_1.NotificacionesService,
        mail_service_1.EmailService])
], CitasService);
//# sourceMappingURL=citas.service.js.map