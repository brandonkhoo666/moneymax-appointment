import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationalTime } from './operationalTime.entity.js';
import { CreateOperationalTimeDto } from './dto/create-operational-time.dto.js';
import { OperationalDay } from '../operationalDays/operationalDay.entity.js';
import { EditOperationalTimeDto } from './dto/edit-operational-time.dto.js';
import { DeleteOperationalTimeDto } from './dto/delete-operational-time.dto.js';

@Injectable()
export class OperationalTimesService {
  constructor(
    @InjectRepository(OperationalTime)
    private readonly operationalTimeRepository: Repository<OperationalTime>,

    @InjectRepository(OperationalDay)
    private readonly operationalDayRepository: Repository<OperationalDay>,
  ) {}

  async initializeOperationalTimes() {
    const operationalTimes = [
      {
        operationalDayId: 2,
        from: '09:00:00',
        to: '18:00:00',
        isAvailable: true,
        remarks: null,
      },
      {
        operationalDayId: 3,
        from: '09:00:00',
        to: '18:00:00',
        isAvailable: true,
        remarks: null,
      },
      {
        operationalDayId: 4,
        from: '09:00:00',
        to: '18:00:00',
        isAvailable: true,
        remarks: null,
      },
      {
        operationalDayId: 5,
        from: '09:00:00',
        to: '18:00:00',
        isAvailable: true,
        remarks: null,
      },
      {
        operationalDayId: 6,
        from: '09:00:00',
        to: '18:00:00',
        isAvailable: true,
        remarks: null,
      },
    ];

    return this.operationalTimeRepository.save(operationalTimes);
  }

  async create(dto: CreateOperationalTimeDto) {
    // check valid operationalDayId
    const operationalDay = await this.operationalDayRepository.findOne({
      where: {
        id: dto.operationalDayId,
        isActive: true,
      },
    });

    if (!operationalDay) {
      throw new NotFoundException(
        `Operational day ${dto.operationalDayId} not found`,
      );
    }

    // check if from & to range overlap with existing from & to of the same operationalDayId
    const overlap = await this.operationalTimeRepository
      .createQueryBuilder('operationalTime')
      .where('operationalTime.operationalDayId = :operationalDayId', {
        operationalDayId: dto.operationalDayId,
      })
      .andWhere('operationalTime.from < :to', {
        to: dto.to,
      })
      .andWhere('operationalTime.to > :from', {
        from: dto.from,
      })
      .getOne();

    if (overlap) {
      throw new BadRequestException(
        `Time range ${dto.from}-${dto.to} overlaps with existing range ${overlap.from}-${overlap.to}`,
      );
    }

    // create
    const operationalTime = this.operationalTimeRepository.create(dto);

    // save
    return this.operationalTimeRepository.save(operationalTime);
  }

  async edit(dto: EditOperationalTimeDto) {
    // check valid id
    const operationalTime = await this.operationalTimeRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!operationalTime) {
      throw new NotFoundException(`Operational time ${dto.id} not found`);
    }

    // check if from & to range overlap with existing from & to
    const overlap = await this.operationalTimeRepository
      .createQueryBuilder('operationalTime')
      .where('operationalTime.id != :id', {
        id: dto.id,
      })
      .andWhere('operationalTime.operationalDayId = :operationalDayId', {
        operationalDayId: operationalTime.operationalDayId,
      })
      .andWhere('operationalTime.from < :to', {
        to: dto.to,
      })
      .andWhere('operationalTime.to > :from', {
        from: dto.from,
      })
      .getOne();

    if (overlap) {
      throw new BadRequestException(
        `Time range ${dto.from}-${dto.to} overlaps with existing range ${overlap.from}-${overlap.to}`,
      );
    }

    operationalTime.from = dto.from;
    operationalTime.to = dto.to;
    operationalTime.isAvailable = dto.isAvailable;
    operationalTime.remarks = dto.remarks;

    // save
    return this.operationalTimeRepository.save(operationalTime);
  }

  async delete(dto: DeleteOperationalTimeDto) {
    const result = await this.operationalTimeRepository.delete(dto.id);

    if (result.affected === 0) {
      throw new NotFoundException(`Operational time ${dto.id} not found`);
    }

    return result;
  }
}
