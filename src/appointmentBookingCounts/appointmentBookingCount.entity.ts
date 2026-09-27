import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('appointment_booking_counts')
@Unique(['appointmentId', 'date', 'startTime'])
export class AppointmentBookingCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appointmentId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column()
  bookedCount: number;
}
