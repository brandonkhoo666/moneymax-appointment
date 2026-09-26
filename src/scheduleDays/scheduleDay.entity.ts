import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedule_days')
export class ScheduleDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
