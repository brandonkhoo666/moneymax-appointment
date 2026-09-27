import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('operational_days')
export class OperationalDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
