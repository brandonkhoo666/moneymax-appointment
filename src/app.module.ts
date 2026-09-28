import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationalDay } from './operationalDays/operationalDay.entity.js';
import { OperationalDaysModule } from './operationalDays/operationalDays.module.js';
import { OperationalTimesModule } from './operationalTimes/operationalTimes.module.js';
import { OperationalTime } from './operationalTimes/operationalTime.entity.js';
import { UnavailableDate } from './unavailableDates/unavailableDate.entity.js';
import { UnavailableDatesModule } from './unavailableDates/unavailableDates.module.js';
import { Appointment } from './appointments/appointment.entity.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { Booking } from './bookings/booking.entity.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { AppointmentBookingCount } from './appointmentBookingCounts/appointmentBookingCount.entity.js';
import { BookingTimeSlot } from './bookingTimeSlots/bookingTimeSlot.entity.js';
import { AppointmentBookingCountsModule } from './appointmentBookingCounts/appointmentBookingCounts.module.js';
import { BookingTimeSlotsModule } from './bookingTimeSlots/bookingTimeSlots.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'moneymax_appointment',
      entities: [
        OperationalDay,
        OperationalTime,
        UnavailableDate,
        Appointment,
        Booking,
        AppointmentBookingCount,
        BookingTimeSlot,
      ],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    OperationalDaysModule,
    OperationalTimesModule,
    UnavailableDatesModule,
    AppointmentsModule,
    BookingsModule,
    AppointmentBookingCountsModule,
    BookingTimeSlotsModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
