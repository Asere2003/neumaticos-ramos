import { EmailService } from './mail.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}