import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookingTimeSlot } from '../bookingTimeSlots/bookingTimeSlot.entity.js';
import { BookingTimeSlotCronService } from './bookingTimeSlotCron.service.js';
import { BookingTimeSlotCronController } from './bookingTimeSlotCron.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([BookingTimeSlot])],

  controllers: [BookingTimeSlotCronController],

  providers: [BookingTimeSlotCronService],
})
export class CronModule {}
