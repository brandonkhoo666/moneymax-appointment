import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ScheduleTime } from '../scheduleTimes/scheduleTime.entity.js';

@Entity('schedule_days')
export class ScheduleDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
