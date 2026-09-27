import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity.js';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { Appointment } from '../appointment/appointment.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Appointment])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
