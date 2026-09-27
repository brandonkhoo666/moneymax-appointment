import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleTimesController } from './scheduleTimes.controller.js';
import { ScheduleTimesService } from './scheduleTimes.service.js';
import { ScheduleTime } from './scheduleTime.entity.js';
import { ScheduleDay } from '../scheduleDays/scheduleDay.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleTime, ScheduleDay])],
  controllers: [ScheduleTimesController],
  providers: [ScheduleTimesService],
})
export class ScheduleTimesModule {}
