import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleTime } from './scheduleTime.entity.js';

@Injectable()
export class ScheduleTimesService {
  constructor(
    @InjectRepository(ScheduleTime)
    private readonly scheduleTimeRepository: Repository<ScheduleTime>,
  ) {}

  async initializeScheduleTimes() {
    const scheduleTimes = [
      {
        scheduleDayId: 2,
        from: 900,
        to: 1800,
        isActive: true,
        remarks: null,
      },
      {
        scheduleDayId: 3,
        from: 900,
        to: 1800,
        isActive: true,
        remarks: null,
      },
      {
        scheduleDayId: 4,
        from: 900,
        to: 1800,
        isActive: true,
        remarks: null,
      },
      {
        scheduleDayId: 5,
        from: 900,
        to: 1800,
        isActive: true,
        remarks: null,
      },
      {
        scheduleDayId: 6,
        from: 900,
        to: 1800,
        isActive: true,
        remarks: null,
      },
    ];

    return this.scheduleTimeRepository.save(scheduleTimes);
  }
}
