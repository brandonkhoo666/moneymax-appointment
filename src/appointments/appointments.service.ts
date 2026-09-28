import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { EditAppointmentDto } from './dto/edit-appointment.dto.js';
import { AppointmentBookingCount } from '../appointmentBookingCounts/appointmentBookingCount.entity.js';
import { UnavailableDate } from '../unavailableDates/unavailableDate.entity.js';
import { OperationalDay } from '../operationalDays/operationalDay.entity.js';
import { OperationalTime } from '../operationalTimes/operationalTime.entity.js';
import { generateTimeSlots } from '../common/utils/time.util.js';
import { APPOINTMENT_CONFIG } from '../configs/appointment.config.js';
import { Booking } from '../bookings/booking.entity.js';
import { BookingTimeSlot } from '../bookingTimeSlots/bookingTimeSlot.entity.js';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(AppointmentBookingCount)
    private readonly appointmentBookingCountRepository: Repository<AppointmentBookingCount>,

    @InjectRepository(UnavailableDate)
    private readonly unavailableDateRepository: Repository<UnavailableDate>,

    @InjectRepository(OperationalDay)
    private readonly operationalDayRepository: Repository<OperationalDay>,

    @InjectRepository(OperationalTime)
    private readonly operationalTimeRepository: Repository<OperationalTime>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(BookingTimeSlot)
    private readonly bookingTimeSlotRepository: Repository<BookingTimeSlot>,
  ) {}

  async create(dto: CreateAppointmentDto) {
    // create
    const appointment = this.appointmentRepository.create(dto);

    // save
    return this.appointmentRepository.save(appointment);
  }

  async edit(dto: EditAppointmentDto) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${dto.id} not found`);
    }

    appointment.title = dto.title;
    appointment.durationInMinute = dto.durationInMinute;
    appointment.maxBookingPerTimeSlot = dto.maxBookingPerTimeSlot;

    return this.appointmentRepository.save(appointment);
  }

  async list(dto: { appointmentId: number; date: string }) {
    // check date within booking period
    const bookingTimeSlot = await this.bookingTimeSlotRepository.findOne({
      where: {
        date: dto.date,
      },
    });

    if (!bookingTimeSlot) {
      throw new ConflictException(
        `The date ${dto.date} is not in our booking period.`,
      );
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

    // get operational times
    const operationalTimes = await this.operationalTimeRepository.find({
      where: {
        operationalDayId: operationalDay.id,
        isAvailable: true,
      },
      order: {
        from: 'ASC',
      },
    });

    if (operationalTimes.length === 0) {
      throw new ConflictException(
        `The date ${dto.date} does not have any operational times.`,
      );
    }

    // get appointment
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id: dto.appointmentId,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${dto.appointmentId} not found`);
    }

    // get existing booking counts
    const bookingCounts = await this.appointmentBookingCountRepository.find({
      where: {
        appointmentId: dto.appointmentId,
        date: dto.date,
      },
    });

    const bookingCountMap = new Map(
      bookingCounts.map((item) => [item.startTime, item.bookedCount]),
    );

    // get existing bookings for this date
    const existingBookings = await this.bookingRepository.find({
      where: {
        date: dto.date,
      },
    });

    // generate valid appointment time slots
    const appointmentTimeSlots: string[] = [];
    for (const operationalTime of operationalTimes) {
      const slots = generateTimeSlots(
        operationalTime.from,
        operationalTime.to,
        APPOINTMENT_CONFIG.appointmentTimeSlotInterval,
      );

      for (const time of slots) {
        // calculate appointment end time
        const [hours, minutes] = time.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + appointment.durationInMinute;
        const endHour = Math.floor(endMinutes / 60);
        const endMinute = endMinutes % 60;
        const endTime =
          `${String(endHour).padStart(2, '0')}:` +
          `${String(endMinute).padStart(2, '0')}:00`;

        // make sure the entire appointment fits inside the operational time
        if (time >= operationalTime.from && endTime <= operationalTime.to) {
          appointmentTimeSlots.push(time);
        }
      }
    }

    return appointmentTimeSlots.map((time) => {
      const bookedCount = bookingCountMap.get(time) ?? 0;

      // calculate candidate appointment end time
      const [hours, minutes] = time.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + appointment.durationInMinute;
      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;
      const endTime =
        `${String(endHour).padStart(2, '0')}:` +
        `${String(endMinute).padStart(2, '0')}:00`;

      // check whether this slot overlaps with an existing booking
      const hasOverlap = existingBookings.some((booking) => {
        // same appointment + same start time is allowed. Capacity is handled by bookedCount
        if (
          booking.appointmentId === dto.appointmentId &&
          booking.startTime === time
        ) {
          return false;
        }

        return booking.startTime < endTime && booking.endTime > time;
      });

      const availableSlots = hasOverlap
        ? 0
        : Math.max(appointment.maxBookingPerTimeSlot - bookedCount, 0);

      return {
        date: dto.date,
        time: time.substring(0, 5),
        available_slots: availableSlots,
      };
    });
  }
}
