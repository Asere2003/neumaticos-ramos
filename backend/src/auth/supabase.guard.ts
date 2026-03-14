import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseGuard implements CanActivate {

  private supabase;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.supabase = createClient(
      this.config.getOrThrow<string>('SUPABASE_URL'),
      this.config.getOrThrow<string>('SUPABASE_SERVICE_KEY'),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    const token = authHeader.split(' ')[1];

    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    request.user = data.user;

    await this.prisma.logAccesoAdmin.create({
      data: {
        adminId:   data.user.id,
        accion:    `${request.method} ${request.url}`,
        ip:        request.ip,
        userAgent: request.headers['user-agent'],
        exito:     true,
      }
    }).catch(() => {});

    return true;
  }
}
