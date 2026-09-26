import { Controller, Post } from '@nestjs/common';
import { ScheduleTimesService } from './scheduleTimes.service.js';

@Controller('scheduleTimes')
export class ScheduleTimesController {
  constructor(private readonly scheduleTimesService: ScheduleTimesService) {}

  @Post('initialize')
  initializeScheduleTimes() {
    return this.scheduleTimesService.initializeScheduleTimes();
  }
}
