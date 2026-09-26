import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleDaysController } from './scheduleDays.controller.js';
import { ScheduleDaysService } from './scheduleDays.service.js';
import { ScheduleDay } from './scheduleDay.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleDay])],
  controllers: [ScheduleDaysController],
  providers: [ScheduleDaysService],
})
export class ScheduleDaysModule {}
