import { Body, Controller, Post } from '@nestjs/common';
import { OperationalDaysService } from './operationalDays.service.js';
import { EditOperationalDayDto } from './dto/edit-operational-day.dto.js';

@Controller('operationalDays')
export class OperationalDaysController {
  constructor(
    private readonly operationalDaysService: OperationalDaysService,
  ) {}

  @Post('initialize')
  initializeOperationalDays() {
    return this.operationalDaysService.initializeOperationalDays();
  }

  @Post('edit')
  edit(@Body() dto: EditOperationalDayDto) {
    return this.operationalDaysService.edit(dto);
  }
}
