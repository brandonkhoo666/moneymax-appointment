import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleTime } from './scheduleTime.entity.js';
import { CreateScheduleTimeDto } from './dto/create-schedule-time.dto.js';
import { ScheduleDay } from '../scheduleDays/scheduleDay.entity.js';
import { EditScheduleTimeDto } from './dto/edit-schedule-time.dto.js';
import { DeleteScheduleTimeDto } from './dto/delete-schedule-time.dto.js';

@Injectable()
export class ScheduleTimesService {
  constructor(
    @InjectRepository(ScheduleTime)
    private readonly scheduleTimeRepository: Repository<ScheduleTime>,

    @InjectRepository(ScheduleDay)
    private readonly scheduleDayRepository: Repository<ScheduleDay>,
  ) {}

  async initializeScheduleTimes() {
    const scheduleTimes = [
      {
        scheduleDayId: 2,
        from: '0900',
        to: '1800',
        isAvailable: true,
        remarks: null,
      },
      {
        scheduleDayId: 3,
        from: '0900',
        to: '1800',
        isAvailable: true,
        remarks: null,
      },
      {
        scheduleDayId: 4,
        from: '0900',
        to: '1800',
        isAvailable: true,
        remarks: null,
      },
      {
        scheduleDayId: 5,
        from: '0900',
        to: '1800',
        isAvailable: true,
        remarks: null,
      },
      {
        scheduleDayId: 6,
        from: '0900',
        to: '1800',
        isAvailable: true,
        remarks: null,
      },
    ];

    return this.scheduleTimeRepository.save(scheduleTimes);
  }

  async create(dto: CreateScheduleTimeDto) {
    // check valid scheduleDayId
    const scheduleDay = await this.scheduleDayRepository.findOne({
      where: {
        id: dto.scheduleDayId,
        isActive: true,
      },
    });

    if (!scheduleDay) {
      throw new NotFoundException(
        `Schedule day ${dto.scheduleDayId} not found`,
      );
    }

    // check if from & to range overlap with existing from & to of the same scheduleDayId
    const overlap = await this.scheduleTimeRepository
      .createQueryBuilder('scheduleTime')
      .where('scheduleTime.scheduleDayId = :scheduleDayId', {
        scheduleDayId: dto.scheduleDayId,
      })
      .andWhere('scheduleTime.from < :to', {
        to: dto.to,
      })
      .andWhere('scheduleTime.to > :from', {
        from: dto.from,
      })
      .getOne();

    if (overlap) {
      throw new BadRequestException(
        `Time range ${dto.from}-${dto.to} overlaps with existing range ${overlap.from}-${overlap.to}`,
      );
    }

    // create
    const scheduleTime = this.scheduleTimeRepository.create(dto);

    // save
    return this.scheduleTimeRepository.save(scheduleTime);
  }

  async edit(dto: EditScheduleTimeDto) {
    // check valid id
    const scheduleTime = await this.scheduleTimeRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!scheduleTime) {
      throw new NotFoundException(`Schedule time ${dto.id} not found`);
    }

    // check if from & to range overlap with existing from & to
    const overlap = await this.scheduleTimeRepository
      .createQueryBuilder('scheduleTime')
      .where('scheduleTime.id != :id', {
        id: dto.id,
      })
      .andWhere('scheduleTime.scheduleDayId = :scheduleDayId', {
        scheduleDayId: scheduleTime.scheduleDayId,
      })
      .andWhere('scheduleTime.from < :to', {
        to: dto.to,
      })
      .andWhere('scheduleTime.to > :from', {
        from: dto.from,
      })
      .getOne();

    if (overlap) {
      throw new BadRequestException(
        `Time range ${dto.from}-${dto.to} overlaps with existing range ${overlap.from}-${overlap.to}`,
      );
    }

    scheduleTime.from = dto.from;
    scheduleTime.to = dto.to;
    scheduleTime.isAvailable = dto.isAvailable;
    scheduleTime.remarks = dto.remarks;

    // save
    return this.scheduleTimeRepository.save(scheduleTime);
  }

  async delete(dto: DeleteScheduleTimeDto) {
    const result = await this.scheduleTimeRepository.delete(dto.id);

    if (result.affected === 0) {
      throw new NotFoundException(`Schedule time ${dto.id} not found`);
    }

    return result;
  }
}
