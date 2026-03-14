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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const citas_service_1 = require("./citas.service");
const create_cita_dto_1 = require("./dto/create-cita.dto");
const supabase_guard_1 = require("../auth/supabase.guard");
const client_1 = require("@prisma/client");
let CitasController = class CitasController {
    service;
    constructor(service) {
        this.service = service;
    }
    slots(fecha, tipoServicio) {
        return this.service.obtenerSlotsDisponibles(fecha, tipoServicio);
    }
    hoy() {
        return this.service.obtenerCitasHoy();
    }
    obtener(id) {
        return this.service.obtener(id);
    }
    crear(dto) {
        return this.service.crear(dto);
    }
    listar(estado, fecha, clienteId, busqueda) {
        return this.service.listar({ estado, fecha, clienteId, busqueda });
    }
    cambiarEstado(id, body) {
        return this.service.cambiarEstado(id, body.estado, body.motivo, body.precioFinal);
    }
};
exports.CitasController = CitasController;
__decorate([
    (0, common_1.Get)('slots'),
    __param(0, (0, common_1.Query)('fecha')),
    __param(1, (0, common_1.Query)('tipoServicio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "slots", null);
__decorate([
    (0, common_1.Get)('hoy'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "hoy", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "obtener", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cita_dto_1.CreateCitaDto]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "crear", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('fecha')),
    __param(2, (0, common_1.Query)('clienteId')),
    __param(3, (0, common_1.Query)('busqueda')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "listar", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "cambiarEstado", null);
exports.CitasController = CitasController = __decorate([
    (0, swagger_1.ApiTags)('Citas'),
    (0, common_1.Controller)('citas'),
    __metadata("design:paramtypes", [citas_service_1.CitasService])
], CitasController);
//# sourceMappingURL=citas.controller.js.map