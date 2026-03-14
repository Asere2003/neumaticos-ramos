import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { VehiculosController } from './vehiculos.controller';
import { VehiculosService } from './vehiculos.service';

@Module({
  imports:     [AuthModule],
  controllers: [VehiculosController],
  providers:   [VehiculosService],
  exports:     [VehiculosService],
})
export class VehiculosModule {}