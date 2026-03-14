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
exports.VehiculosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VehiculosService = class VehiculosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crear(dto) {
        const existe = await this.prisma.vehiculo.findUnique({
            where: { matricula: dto.matricula.toUpperCase() },
        });
        if (existe) {
            if (existe.clienteId === dto.clienteId)
                return existe;
            throw new common_1.ConflictException('Matrícula ya registrada');
        }
        return this.prisma.vehiculo.create({
            data: {
                marca: dto.marca,
                modelo: dto.modelo,
                matricula: dto.matricula.toUpperCase(),
                anio: dto.anio,
                medidaNeumaticoDelantero: dto.medidaNeumaticoDelantero,
                clienteId: dto.clienteId,
            },
        });
    }
    async listarPorCliente(clienteId) {
        return this.prisma.vehiculo.findMany({
            where: { clienteId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async obtener(id) {
        const vehiculo = await this.prisma.vehiculo.findUnique({
            where: { id },
            include: {
                citas: {
                    orderBy: { fecha: 'desc' },
                    take: 5,
                    include: { servicio: true },
                },
            },
        });
        if (!vehiculo)
            throw new common_1.NotFoundException('Vehículo no encontrado');
        return vehiculo;
    }
};
exports.VehiculosService = VehiculosService;
exports.VehiculosService = VehiculosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiculosService);
//# sourceMappingURL=vehiculos.service.js.map