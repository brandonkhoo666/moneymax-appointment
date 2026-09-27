import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnavailableDate } from './unavailableDate.entity.js';
import { CreateUnavailableDateDto } from './dto/create-unavailable-date.dto.js';
import { DeleteUnavailableDateDto } from './dto/delete-unavailable-date.dto.js';

@Injectable()
export class UnavailableDatesService {
  constructor(
    @InjectRepository(UnavailableDate)
    private readonly unavailableDateRepository: Repository<UnavailableDate>,
  ) {}

  async create(dto: CreateUnavailableDateDto) {
    const existing = await this.unavailableDateRepository.findOne({
      where: {
        date: dto.date,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Unavailable date ${dto.date} already exists`,
      );
    }

    // create
    const unavailableDate = this.unavailableDateRepository.create(dto);

    // save
    return this.unavailableDateRepository.save(unavailableDate);
  }

  async delete(dto: DeleteUnavailableDateDto) {
    const result = await this.unavailableDateRepository.delete(dto.id);

    if (result.affected === 0) {
      throw new NotFoundException(`Schedule time ${dto.id} not found`);
    }

    return result;
  }
}
