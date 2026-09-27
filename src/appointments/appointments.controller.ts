import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { EditAppointmentDto } from './dto/edit-appointment.dto.js';
import { ListAppointmentSlotDto } from './dto/list-appointment-slot.dto.js';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('create')
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Post('edit')
  edit(@Body() dto: EditAppointmentDto) {
    return this.appointmentsService.edit(dto);
  }

  @Get('list/:appointmentId')
  list(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Query() dto: ListAppointmentSlotDto,
  ) {
    return this.appointmentsService.list({
      appointmentId,
      date: dto.date,
    });
  }
}
