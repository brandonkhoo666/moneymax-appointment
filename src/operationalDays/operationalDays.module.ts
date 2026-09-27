import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationalDaysController } from './operationalDays.controller.js';
import { OperationalDaysService } from './operationalDays.service.js';
import { OperationalDay } from './operationalDay.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([OperationalDay])],
  controllers: [OperationalDaysController],
  providers: [OperationalDaysService],
})
export class OperationalDaysModule {}
