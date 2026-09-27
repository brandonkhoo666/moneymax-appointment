import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity.js';
import { MakeBookingDto } from './dto/make-booking.dto.js';
import { Appointment } from '../appointment/appointment.entity.js';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async makeBooking(dto: MakeBookingDto) {
    // check valid appointment
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id: dto.appointmentId,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${dto.appointmentId} not found`);
    }

    // create
    const booking = this.bookingRepository.create(dto);

    // save
    return this.bookingRepository.save(booking);
  }
}
