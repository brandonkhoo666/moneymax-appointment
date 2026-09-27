import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('booking_time_slots')
@Unique(['date', 'startTime'])
export class BookingTimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;
}
