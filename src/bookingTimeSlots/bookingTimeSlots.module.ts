import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingTimeSlot } from './bookingTimeSlot.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([BookingTimeSlot])],
  controllers: [],
  providers: [],
})
export class BookingTimeSlotsModule {}
