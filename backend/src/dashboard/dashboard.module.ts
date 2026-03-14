import { AuthModule } from '../auth/auth.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Module } from '@nestjs/common';

@Module({
  imports:     [AuthModule],
  controllers: [DashboardController],
  providers:   [DashboardService],
})
export class DashboardModule {}