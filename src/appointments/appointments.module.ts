import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity.js';
import { AppointmentsController } from './appointments.controller.js';
import { AppointmentsService } from './appointments.service.js';
import { AppointmentBookingCount } from '../appointmentBookingCounts/appointmentBookingCount.entity.js';
import { UnavailableDate } from '../unavailableDates/unavailableDate.entity.js';
import { OperationalDay } from '../operationalDays/operationalDay.entity.js';
import { OperationalTime } from '../operationalTimes/operationalTime.entity.js';
import { Booking } from '../bookings/booking.entity.js';
import { BookingTimeSlot } from '../bookingTimeSlots/bookingTimeSlot.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      UnavailableDate,
      OperationalDay,
      OperationalTime,
      AppointmentBookingCount,
      Booking,
      BookingTimeSlot,
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
