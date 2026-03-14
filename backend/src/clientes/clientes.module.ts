import { AuthModule } from '../auth/auth.module';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { Module } from '@nestjs/common';

@Module({
  imports:     [AuthModule],
  controllers: [ClientesController],
  providers:   [ClientesService],
  exports:     [ClientesService],
})
export class ClientesModule {}