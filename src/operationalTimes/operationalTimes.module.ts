import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationalTimesController } from './operationalTimes.controller.js';
import { OperationalTimesService } from './operationalTimes.service.js';
import { OperationalTime } from './operationalTime.entity.js';
import { OperationalDay } from '../operationalDays/operationalDay.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([OperationalTime, OperationalDay])],
  controllers: [OperationalTimesController],
  providers: [OperationalTimesService],
})
export class OperationalTimesModule {}
