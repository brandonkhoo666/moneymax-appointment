import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  durationInMinute: number;

  @Column()
  maxBookingPerTimeSlot: number;
}
