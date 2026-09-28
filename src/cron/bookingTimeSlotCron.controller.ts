import { Controller, Post } from '@nestjs/common';
import { BookingTimeSlotCronService } from './bookingTimeSlotCron.service.js';

@Controller('cron')
export class BookingTimeSlotCronController {
  constructor(
    private readonly bookingTimeSlotCronService: BookingTimeSlotCronService,
  ) {}

  @Post('booking-time-slots/initialize')
  initializeBookingTimeSlots() {
    return this.bookingTimeSlotCronService.generateSlotsForNext30Days();
  }
}
