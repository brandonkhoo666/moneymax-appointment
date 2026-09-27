import { Body, Controller, Post } from '@nestjs/common';
import { MakeBookingDto } from './dto/make-booking.dto.js';
import { BookingsService } from './bookings.service.js';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('makeBooking')
  makeBooking(@Body() dto: MakeBookingDto) {
    return this.bookingsService.makeBooking(dto);
  }
}
