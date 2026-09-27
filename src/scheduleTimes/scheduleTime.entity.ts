import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedule_times')
export class ScheduleTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scheduleDayId: number;

  @Column({ type: 'time' })
  from: string;

  @Column({ type: 'time' })
  to: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'varchar', nullable: true })
  remarks: string | null;
}
