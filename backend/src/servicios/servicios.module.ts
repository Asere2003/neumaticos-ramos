import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { ServiciosController } from './servicios.controller';
import { ServiciosService } from './servicios.service';

@Module({
  imports:     [AuthModule],
  controllers: [ServiciosController],
  providers:   [ServiciosService],
  exports:     [ServiciosService],
})
export class ServiciosModule {}