import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class SupabaseGuard implements CanActivate {
    private config;
    private prisma;
    private supabase;
    constructor(config: ConfigService, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
