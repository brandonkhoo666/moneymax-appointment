import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationalDay } from './operationalDay.entity.js';
import { EditOperationalDayDto } from './dto/edit-operational-day.dto.js';

@Injectable()
export class OperationalDaysService {
  constructor(
    @InjectRepository(OperationalDay)
    private readonly operationalDayRepository: Repository<OperationalDay>,
  ) {}

  async initializeOperationalDays() {
    const operationalDays = [
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

    return this.operationalDayRepository.save(operationalDays);
  }

  async edit(dto: EditOperationalDayDto) {
    const operationalDay = await this.operationalDayRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!operationalDay) {
      throw new NotFoundException(`Operational day ${dto.id} not found`);
    }

    operationalDay.name = dto.name;
    operationalDay.isActive = dto.isActive;

    return this.operationalDayRepository.save(operationalDay);
  }
}
