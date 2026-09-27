import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('operational_times')
export class OperationalTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operationalDayId: number;

  @Column({ type: 'time' })
  from: string;

  @Column({ type: 'time' })
  to: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'varchar', nullable: true })
  remarks: string | null;
}
