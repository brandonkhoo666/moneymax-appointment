import { Body, Controller, Post } from '@nestjs/common';
import { OperationalTimesService } from './operationalTimes.service.js';
import { CreateOperationalTimeDto } from './dto/create-operational-time.dto.js';
import { EditOperationalTimeDto } from './dto/edit-operational-time.dto.js';
import { DeleteOperationalTimeDto } from './dto/delete-operational-time.dto.js';

@Controller('operationalTimes')
export class OperationalTimesController {
  constructor(
    private readonly operationalTimesService: OperationalTimesService,
  ) {}

  @Post('initialize')
  initializeOperationalTimes() {
    return this.operationalTimesService.initializeOperationalTimes();
  }

  @Post('create')
  create(@Body() dto: CreateOperationalTimeDto) {
    return this.operationalTimesService.create(dto);
  }

  @Post('edit')
  editcheduleTimes(@Body() dto: EditOperationalTimeDto) {
    return this.operationalTimesService.edit(dto);
  }

  @Post('delete')
  delete(@Body() dto: DeleteOperationalTimeDto) {
    return this.operationalTimesService.delete(dto);
  }
}
