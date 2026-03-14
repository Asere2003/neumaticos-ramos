import { AuthModule } from '../auth/auth.module';
import { ConfiguracionController } from './configuracion.controller';
import { ConfiguracionService } from './configuracion.service';
import { Module } from '@nestjs/common';

@Module({
  imports:     [AuthModule],
  controllers: [ConfiguracionController],
  providers:   [ConfiguracionService],
})
export class ConfiguracionModule {}