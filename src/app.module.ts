import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleDay } from './scheduleDays/scheduleDay.entity.js';
import { ScheduleDaysModule } from './scheduleDays/scheduleDays.module.js';
import { ScheduleTimesModule } from './scheduleTimes/scheduleTimes.module.js';
import { ScheduleTime } from './scheduleTimes/scheduleTime.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'moneymax_appointment',
      entities: [ScheduleDay, ScheduleTime],
      synchronize: true,
    }),
    ScheduleDaysModule,
    ScheduleTimesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
