import { Controller, Post } from '@nestjs/common';
import { ScheduleDaysService } from './scheduleDays.service.js';

@Controller('scheduleDays')
export class ScheduleDaysController {
  constructor(private readonly scheduleDaysService: ScheduleDaysService) {}

  @Post('initialize')
  initializeScheduleDays() {
    return this.scheduleDaysService.initializeScheduleDays();
  }

  //   @Post('create')
  //   create(@Body() dto: CreateScheduleDayDto) {
  //     return this.scheduleDaysService.create(dto);
  //   }
}
