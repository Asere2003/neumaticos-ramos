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
exports.SupabaseGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseGuard = class SupabaseGuard {
    config;
    prisma;
    supabase;
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.supabase = (0, supabase_js_1.createClient)(this.config.getOrThrow('SUPABASE_URL'), this.config.getOrThrow('SUPABASE_SERVICE_KEY'));
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Token no proporcionado');
        }
        const token = authHeader.split(' ')[1];
        const { data, error } = await this.supabase.auth.getUser(token);
        if (error || !data.user) {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
        request.user = data.user;
        await this.prisma.logAccesoAdmin.create({
            data: {
                adminId: data.user.id,
                accion: `${request.method} ${request.url}`,
                ip: request.ip,
                userAgent: request.headers['user-agent'],
                exito: true,
            }
        }).catch(() => { });
        return true;
    }
};
exports.SupabaseGuard = SupabaseGuard;
exports.SupabaseGuard = SupabaseGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], SupabaseGuard);
//# sourceMappingURL=supabase.guard.js.map