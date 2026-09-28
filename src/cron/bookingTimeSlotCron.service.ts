import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookingTimeSlot } from '../bookingTimeSlots/bookingTimeSlot.entity.js';
import { generateDailyLockSlots } from '../common/utils/time.util.js';

@Injectable()
export class BookingTimeSlotCronService {
  private readonly logger = new Logger(BookingTimeSlotCronService.name);

  constructor(
    @InjectRepository(BookingTimeSlot)
    private readonly bookingTimeSlotRepository: Repository<BookingTimeSlot>,
  ) {}

  // run everyday 00:05:00
  @Cron('5 0 * * *', {
    timeZone: 'Asia/Kuala_Lumpur',
  })
  async generateBookingTimeSlots() {
    this.logger.log('Starting booking time slot generation...');

    try {
      await this.generateSlotsForNext30Days();

      this.logger.log('Booking time slot generation completed.');
    } catch (error) {
      this.logger.error('Failed to generate booking time slots', error);
    }
  }

  async generateSlotsForNext30Days() {
    const slots: {
      date: string;
      startTime: string;
    }[] = [];

    const today = new Date();

    const timeSlots = generateDailyLockSlots();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);

      date.setDate(today.getDate() + i);

      const dateString = this.formatDate(date);

      for (const startTime of timeSlots) {
        slots.push({
          date: dateString,
          startTime,
        });
      }
    }

    await this.bookingTimeSlotRepository
      .createQueryBuilder()
      .insert()
      .into(BookingTimeSlot)
      .values(slots)
      .orIgnore()
      .execute();

    this.logger.log(`Processed ${slots.length} booking time slots.`);

    return {
      processed: slots.length,
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
