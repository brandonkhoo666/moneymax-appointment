import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { EditAppointmentDto } from './dto/edit-appointment.dto.js';

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

  // @Post('getAvailableTimeSlots')
  // getAvailableTimeSlots(@Body() dto: EditAppointmentDto) {
  //   return this.appointmentsService.edit(dto);
  // }
}
