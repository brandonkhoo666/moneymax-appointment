import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('unavailable_dates')
export class UnavailableDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true })
  date: string;

  @Column({ type: 'varchar' })
  remarks: string;
}
