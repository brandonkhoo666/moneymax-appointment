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
import { Appointment } from './appointment/appointment.entity.js';
import { AppointmentsModule } from './appointment/appointments.module.js';
import { Booking } from './booking/booking.entity.js';
import { BookingsModule } from './booking/bookings.module.js';

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
      ],
      synchronize: true,
    }),
    OperationalDaysModule,
    OperationalTimesModule,
    UnavailableDatesModule,
    AppointmentsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
