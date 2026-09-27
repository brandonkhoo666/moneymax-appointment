import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity.js';
import { MakeBookingDto } from './dto/make-booking.dto.js';
import { Appointment } from '../appointments/appointment.entity.js';
import { UnavailableDate } from '../unavailableDates/unavailableDate.entity.js';
import { OperationalDay } from '../operationalDays/operationalDay.entity.js';
import { OperationalTime } from '../operationalTimes/operationalTime.entity.js';
import { DataSource } from 'typeorm';
import { AppointmentBookingCountsService } from '../appointmentBookingCounts/appointmentBookingCounts.service.js';
import { BookingTimeSlot } from '../bookingTimeSlots/bookingTimeSlot.entity.js';
import { APPOINTMENT_CONFIG } from '../configs/appointment.config.js';
import { generateTimeSlots } from '../common/utils/time.util.js';

@Injectable()
export class BookingsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly appointmentBookingCountsService: AppointmentBookingCountsService,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(UnavailableDate)
    private readonly unavailableDateRepository: Repository<UnavailableDate>,

    @InjectRepository(OperationalDay)
    private readonly operationalDayRepository: Repository<OperationalDay>,

    @InjectRepository(OperationalTime)
    private readonly operationalTimeRepository: Repository<OperationalTime>,
  ) {}

  async makeBooking(dto: MakeBookingDto) {
    const [hours, minutes] = dto.startTime.split(':').map(Number);

    // validate start time is in 30-minute intervals
    if (minutes !== 0 && minutes !== 30) {
      throw new BadRequestException('Invalid startTime.');
    }

    // check valid appointment
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id: dto.appointmentId,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${dto.appointmentId} not found`);
    }

    // check unavailable date
    const unavailableDate = await this.unavailableDateRepository.findOne({
      where: {
        date: dto.date,
      },
    });

    if (unavailableDate) {
      throw new ConflictException(
        `The date ${unavailableDate.date} is not operational due to ${unavailableDate.remarks}`,
      );
    }

    // check operational day
    const bookingDate = new Date(dto.date);
    const bookingDay = bookingDate
      .toLocaleDateString('en-US', {
        weekday: 'long',
      })
      .toLowerCase();

    const operationalDay = await this.operationalDayRepository
      .createQueryBuilder('operationalDay')
      .where('LOWER(operationalDay.name) = LOWER(:name)', {
        name: bookingDay,
      })
      .andWhere('operationalDay.isActive = :isActive', {
        isActive: true,
      })
      .getOne();

    if (!operationalDay) {
      throw new ConflictException(
        `The date ${dto.date} is not in operational day.`,
      );
    }

    // calculate booking end time
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + appointment.durationInMinute;
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;
    const endTime =
      `${String(endHour).padStart(2, '0')}:` +
      `${String(endMinute).padStart(2, '0')}:00`;

    // check operational time
    const operationalTime = await this.operationalTimeRepository
      .createQueryBuilder('operationalTime')
      .where('operationalTime.from <= :startTime', {
        startTime: dto.startTime,
      })
      .andWhere('operationalTime.to >= :endTime', {
        endTime,
      })
      .andWhere('operationalTime.operationalDayId = :operationalDayId', {
        operationalDayId: operationalDay.id,
      })
      .andWhere('operationalTime.isAvailable = :isAvailable', {
        isAvailable: true,
      })
      .getOne();

    if (!operationalTime) {
      throw new ConflictException(
        `The time ${dto.startTime} - ${endTime} is not in operational time.`,
      );
    }

    // start transaction
    return this.dataSource.transaction(async (manager) => {
      // generate time slots
      const slots = generateTimeSlots(
        dto.startTime,
        endTime,
        APPOINTMENT_CONFIG.minSlotDuration,
        false,
      );

      // create missing lock rows
      await manager
        .getRepository(BookingTimeSlot)
        .createQueryBuilder()
        .insert()
        .into(BookingTimeSlot)
        .values(
          slots.map((slot) => ({
            date: dto.date,
            startTime: slot,
          })),
        )
        .orIgnore()
        .execute();

      // lock all required slots
      await manager
        .getRepository(BookingTimeSlot)
        .createQueryBuilder('slot')
        .setLock('pessimistic_write')
        .where('slot.date = :date', {
          date: dto.date,
        })
        .andWhere('slot.startTime IN (:...slots)', {
          slots,
        })
        .getMany();

      // check overlapping bookings with other appointments
      const clashedOtherAppointmentBookings = await manager
        .getRepository(Booking)
        .createQueryBuilder('booking')
        .where('booking.date = :date', {
          date: dto.date,
        })
        .andWhere('booking.appointmentId != :appointmentId', {
          appointmentId: dto.appointmentId,
        })
        .andWhere('booking.startTime < :endTime', {
          endTime,
        })
        .andWhere('booking.endTime > :startTime', {
          startTime: dto.startTime,
        })
        .getOne();

      if (clashedOtherAppointmentBookings) {
        throw new ConflictException(`The time slot is not available.`);
      }

      // check overlapping bookings within same appointments
      const clashedSameAppointmentBooking = await manager
        .getRepository(Booking)
        .createQueryBuilder('booking')
        .where('booking.date = :date', {
          date: dto.date,
        })
        .andWhere('booking.appointmentId = :appointmentId', {
          appointmentId: dto.appointmentId,
        })
        .andWhere('booking.startTime < :endTime', {
          endTime,
        })
        .andWhere('booking.endTime > :startTime', {
          startTime: dto.startTime,
        })
        .andWhere('booking.startTime != :startTime', {
          startTime: dto.startTime,
        })
        .getOne();

      if (clashedSameAppointmentBooking) {
        throw new ConflictException(
          'This appointment overlaps with an existing booking.',
        );
      }

      // atomic increment booking count
      await this.appointmentBookingCountsService.atomicIncrementBookingCount(
        manager,
        dto.appointmentId,
        dto.date,
        dto.startTime,
        appointment.maxBookingPerTimeSlot,
      );

      // create booking
      const booking = manager.create(Booking, {
        appointmentId: dto.appointmentId,
        date: dto.date,
        startTime: dto.startTime,
        endTime,
        attendeeName: dto.attendeeName,
        attendeeEmail: dto.attendeeEmail,
      });

      // save booking
      return manager.save(booking);
    });
  }
}
