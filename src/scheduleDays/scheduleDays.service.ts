import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleDay } from './scheduleDay.entity.js';
import { EditScheduleDayDto } from './dto/edit-schedule-day.dto.js';

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

  async edit(dto: EditScheduleDayDto) {
    const scheduleDay = await this.scheduleDayRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!scheduleDay) {
      throw new NotFoundException(`Schedule day ${dto.id} not found`);
    }

    scheduleDay.name = dto.name;
    scheduleDay.isActive = dto.isActive;

    return this.scheduleDayRepository.save(scheduleDay);
  }
}
