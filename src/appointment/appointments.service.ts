import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { EditAppointmentDto } from './dto/edit-appointment.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(dto: CreateAppointmentDto) {
    // create
    const appointment = this.appointmentRepository.create(dto);

    // save
    return this.appointmentRepository.save(appointment);
  }

  async edit(dto: EditAppointmentDto) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${dto.id} not found`);
    }

    appointment.title = dto.title;
    appointment.durationInMinute = dto.durationInMinute;
    appointment.maxBookingPerTimeSlot = dto.maxBookingPerTimeSlot;

    return this.appointmentRepository.save(appointment);
  }
}
