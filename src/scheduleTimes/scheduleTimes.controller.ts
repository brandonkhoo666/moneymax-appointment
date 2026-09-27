import { Body, Controller, Post } from '@nestjs/common';
import { ScheduleTimesService } from './scheduleTimes.service.js';
import { CreateScheduleTimeDto } from './dto/create-schedule-time.dto.js';
import { EditScheduleTimeDto } from './dto/edit-schedule-time.dto.js';
import { DeleteScheduleTimeDto } from './dto/delete-schedule-time.dto.js';

@Controller('scheduleTimes')
export class ScheduleTimesController {
  constructor(private readonly scheduleTimesService: ScheduleTimesService) {}

  @Post('initialize')
  initializeScheduleTimes() {
    return this.scheduleTimesService.initializeScheduleTimes();
  }

  @Post('create')
  create(@Body() dto: CreateScheduleTimeDto) {
    return this.scheduleTimesService.create(dto);
  }

  @Post('edit')
  editcheduleTimes(@Body() dto: EditScheduleTimeDto) {
    return this.scheduleTimesService.edit(dto);
  }

  @Post('delete')
  delete(@Body() dto: DeleteScheduleTimeDto) {
    return this.scheduleTimesService.delete(dto);
  }
}
