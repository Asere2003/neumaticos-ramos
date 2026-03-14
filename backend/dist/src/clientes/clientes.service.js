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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClientesService = class ClientesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crear(dto) {
        if (!dto.aceptaTerminos) {
            throw new common_1.BadRequestException('Debes aceptar los términos y la política de privacidad');
        }
        const existe = await this.prisma.cliente.findUnique({
            where: { telefono: dto.telefono },
        });
        if (existe && !existe.eliminado)
            return existe;
        return this.prisma.cliente.create({
            data: {
                nombre: dto.nombre,
                telefono: dto.telefono,
                email: dto.email,
                aceptaTerminos: dto.aceptaTerminos,
                aceptaMarketing: dto.aceptaMarketing ?? false,
                fechaConsentimiento: new Date(),
            },
        });
    }
    async listar(busqueda) {
        const where = { eliminado: false };
        if (busqueda) {
            where.OR = [
                { nombre: { contains: busqueda, mode: 'insensitive' } },
                { telefono: { contains: busqueda } },
                { email: { contains: busqueda, mode: 'insensitive' } },
                { vehiculos: { some: { matricula: { contains: busqueda.toUpperCase() } } } },
            ];
        }
        return this.prisma.cliente.findMany({
            where,
            include: {
                vehiculos: true,
                citas: {
                    orderBy: { fecha: 'desc' },
                    take: 5,
                    include: { servicio: true },
                },
                _count: { select: { citas: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async obtener(id) {
        const cliente = await this.prisma.cliente.findFirst({
            where: { id, eliminado: false },
            include: {
                vehiculos: true,
                citas: {
                    orderBy: { fecha: 'desc' },
                    include: { servicio: true, vehiculo: true },
                },
                _count: { select: { citas: true } },
            },
        });
        if (!cliente)
            throw new common_1.NotFoundException('Cliente no encontrado');
        return cliente;
    }
    async eliminar(id) {
        const cliente = await this.prisma.cliente.findUnique({ where: { id } });
        if (!cliente)
            throw new common_1.NotFoundException('Cliente no encontrado');
        return this.prisma.cliente.update({
            where: { id },
            data: {
                eliminado: true,
                eliminadoAt: new Date(),
                nombre: 'ELIMINADO (RGPD)',
                telefono: `ELIMINADO_${id}`,
                email: null,
                notasInternas: null,
            },
        });
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map