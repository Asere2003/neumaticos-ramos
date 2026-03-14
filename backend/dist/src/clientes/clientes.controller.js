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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clientes_service_1 = require("./clientes.service");
const create_cliente_dto_1 = require("./dto/create-cliente.dto");
const supabase_guard_1 = require("../auth/supabase.guard");
let ClientesController = class ClientesController {
    service;
    constructor(service) {
        this.service = service;
    }
    crear(dto) {
        return this.service.crear(dto);
    }
    listar(busqueda) {
        return this.service.listar(busqueda);
    }
    obtener(id) {
        return this.service.obtener(id);
    }
    eliminar(id) {
        return this.service.eliminar(id);
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cliente_dto_1.CreateClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "crear", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('busqueda')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "obtener", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "eliminar", null);
exports.ClientesController = ClientesController = __decorate([
    (0, swagger_1.ApiTags)('Clientes'),
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
//# sourceMappingURL=clientes.controller.js.map