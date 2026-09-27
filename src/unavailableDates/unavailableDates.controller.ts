import { Body, Controller, Post } from '@nestjs/common';
import { UnavailableDatesService } from './unavailableDates.service.js';
import { CreateUnavailableDateDto } from './dto/create-unavailable-date.dto.js';
import { DeleteUnavailableDateDto } from './dto/delete-unavailable-date.dto.js';

@Controller('unavailableDates')
export class UnavailableDatesController {
  constructor(
    private readonly unavailableDatesService: UnavailableDatesService,
  ) {}

  @Post('create')
  create(@Body() dto: CreateUnavailableDateDto) {
    return this.unavailableDatesService.create(dto);
  }

  @Post('delete')
  edit(@Body() dto: DeleteUnavailableDateDto) {
    return this.unavailableDatesService.delete(dto);
  }
}
