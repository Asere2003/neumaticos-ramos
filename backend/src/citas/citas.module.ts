import { AuthModule } from '../auth/auth.module';
import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';
import { Module } from '@nestjs/common';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports:     [AuthModule, NotificacionesModule],
  controllers: [CitasController],
  providers:   [CitasService],
  exports:     [CitasService],
})
export class CitasModule {}