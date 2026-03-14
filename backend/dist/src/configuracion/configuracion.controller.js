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
exports.ConfiguracionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const configuracion_service_1 = require("./configuracion.service");
const supabase_guard_1 = require("../auth/supabase.guard");
let ConfiguracionController = class ConfiguracionController {
    service;
    constructor(service) {
        this.service = service;
    }
    publico() {
        return this.service.obtenerPublico();
    }
    completa() {
        return this.service.obtenerCompleta();
    }
    actualizarTaller(dto) {
        return this.service.actualizarTaller(dto);
    }
    actualizarNotificaciones(dto) {
        return this.service.actualizarNotificaciones(dto);
    }
};
exports.ConfiguracionController = ConfiguracionController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfiguracionController.prototype, "publico", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfiguracionController.prototype, "completa", null);
__decorate([
    (0, common_1.Patch)('taller'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConfiguracionController.prototype, "actualizarTaller", null);
__decorate([
    (0, common_1.Patch)('notificaciones'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConfiguracionController.prototype, "actualizarNotificaciones", null);
exports.ConfiguracionController = ConfiguracionController = __decorate([
    (0, swagger_1.ApiTags)('Configuración'),
    (0, common_1.Controller)('configuracion'),
    __metadata("design:paramtypes", [configuracion_service_1.ConfiguracionService])
], ConfiguracionController);
//# sourceMappingURL=configuracion.controller.js.map