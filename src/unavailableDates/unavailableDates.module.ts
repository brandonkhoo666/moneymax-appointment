import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnavailableDate } from './unavailableDate.entity.js';
import { UnavailableDatesController } from './unavailableDates.controller.js';
import { UnavailableDatesService } from './unavailableDates.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([UnavailableDate])],
  controllers: [UnavailableDatesController],
  providers: [UnavailableDatesService],
})
export class UnavailableDatesModule {}
