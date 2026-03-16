import { AuthModule } from '../auth/auth.module';
import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';
import { EmailModule } from '../mail/email.module';
import { Module } from '@nestjs/common';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports:     [AuthModule, NotificacionesModule, EmailModule],
  controllers: [CitasController],
  providers:   [CitasService],
  exports:     [CitasService],
})
export class CitasModule {}