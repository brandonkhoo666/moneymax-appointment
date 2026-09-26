import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ScheduleDay } from '../scheduleDays/scheduleDay.entity.js';

@Entity('schedule_times')
export class ScheduleTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scheduleDayId: number;

  @ManyToOne(() => ScheduleDay)
  @JoinColumn({ name: 'scheduleDayId' })
  scheduleDay: ScheduleDay;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  remarks: string | null;
}
