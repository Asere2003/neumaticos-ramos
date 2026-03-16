import { EmailModule } from '../mail/email.module';
import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';

@Module({
  imports: [EmailModule],
  providers: [NotificacionesService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}