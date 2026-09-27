import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentBookingCount } from './appointmentBookingCount.entity.js';
import { AppointmentBookingCountsService } from './appointmentBookingCounts.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentBookingCount])],
  controllers: [],
  providers: [AppointmentBookingCountsService],
  exports: [AppointmentBookingCountsService],
})
export class AppointmentBookingCountsModule {}
