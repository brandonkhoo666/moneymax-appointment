import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appointmentId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  attendeeName: string;

  @Column()
  attendeeEmail: string;
}
