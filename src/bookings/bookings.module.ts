import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity.js';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { Appointment } from '../appointments/appointment.entity.js';
import { UnavailableDate } from '../unavailableDates/unavailableDate.entity.js';
import { OperationalDay } from '../operationalDays/operationalDay.entity.js';
import { OperationalTime } from '../operationalTimes/operationalTime.entity.js';
import { AppointmentBookingCountsModule } from '../appointmentBookingCounts/appointmentBookingCounts.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Appointment,
      UnavailableDate,
      OperationalDay,
      OperationalTime,
    ]),
    AppointmentBookingCountsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
