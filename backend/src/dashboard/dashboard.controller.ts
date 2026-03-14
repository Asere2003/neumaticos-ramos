import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(SupabaseGuard)
@ApiBearerAuth()
export class DashboardController {

  constructor(private service: DashboardService) {}

  @Get()
  resumen() {
    return this.service.obtenerResumen();
  }
}