import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AppointmentBookingCount } from './appointmentBookingCount.entity.js';

@Injectable()
export class AppointmentBookingCountsService {
  constructor(
    @InjectRepository(AppointmentBookingCount)
    private readonly appointmentBookingCountRepository: Repository<AppointmentBookingCount>,
  ) {}

  async atomicIncrementBookingCount(
    manager: EntityManager,
    appointmentId: number,
    date: string,
    startTime: string,
    maxCount: number,
  ) {
    const result = await manager.query(
      `
    INSERT INTO appointment_booking_counts
      (appointmentId, date, startTime, bookedCount)
    VALUES (?, ?, ?, 1)
    ON DUPLICATE KEY UPDATE
      bookedCount = IF(
        bookedCount < ?,
        bookedCount + 1,
        bookedCount
      )
    `,
      [appointmentId, date, startTime, maxCount],
    );

    // inserted new row or existing row was incremented
    if (result.insertId !== 0) {
      return true;
    }

    throw new ConflictException('Maximum booking count reached');
  }
}
