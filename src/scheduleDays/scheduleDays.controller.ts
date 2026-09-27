import { Body, Controller, Post } from '@nestjs/common';
import { ScheduleDaysService } from './scheduleDays.service.js';
import { EditScheduleDayDto } from './dto/edit-schedule-day.dto.js';

@Controller('scheduleDays')
export class ScheduleDaysController {
  constructor(private readonly scheduleDaysService: ScheduleDaysService) {}

  @Post('initialize')
  initializeScheduleDays() {
    return this.scheduleDaysService.initializeScheduleDays();
  }

  @Post('edit')
  edit(@Body() dto: EditScheduleDayDto) {
    return this.scheduleDaysService.edit(dto);
  }
}
