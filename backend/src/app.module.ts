import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CalendarioModule } from './calendario/calendario.module';
import { CitasModule } from './citas/citas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ConfigModule } from '@nestjs/config';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Module } from '@nestjs/common';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServiciosModule } from './servicios/servicios.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl:   60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    ClientesModule,
    VehiculosModule,
    ServiciosModule,
    CitasModule,
    CalendarioModule,
    NotificacionesModule,
    DashboardModule,
    ConfiguracionModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}