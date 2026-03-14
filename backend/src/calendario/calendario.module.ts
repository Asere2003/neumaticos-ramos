import { AuthModule } from '../auth/auth.module';
import { CalendarioController } from './calendario.controller';
import { CalendarioService } from './calendario.service';
import { Module } from '@nestjs/common';

@Module({
  imports:     [AuthModule],
  controllers: [CalendarioController],
  providers:   [CalendarioService],
})
export class CalendarioModule {}