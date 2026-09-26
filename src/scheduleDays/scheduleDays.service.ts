import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleDay } from './scheduleDay.entity.js';

@Injectable()
export class ScheduleDaysService {
  constructor(
    @InjectRepository(ScheduleDay)
    private readonly scheduleDayRepository: Repository<ScheduleDay>,
  ) {}

  async initializeScheduleDays() {
    const scheduleDays = [
      {
        name: 'Sunday',
        isActive: false,
      },
      {
        name: 'Monday',
        isActive: true,
      },
      {
        name: 'Tuesday',
        isActive: true,
      },
      {
        name: 'Wednesday',
        isActive: true,
      },
      {
        name: 'Thursday',
        isActive: true,
      },
      {
        name: 'Friday',
        isActive: true,
      },
      {
        name: 'Saturday',
        isActive: false,
      },
    ];

    return this.scheduleDayRepository.save(scheduleDays);
  }

  //   async create(dto: CreateScheduleDayDto) {
  //     const scheduleDay = this.scheduleDayRepository.create(dto);

  //     return await this.scheduleDayRepository.save(scheduleDay);
  //   }
}
