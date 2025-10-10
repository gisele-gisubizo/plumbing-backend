import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PlumbingService {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string; // e.g., 'Faucet Repair'

  @Column('decimal')
  price!: number; // e.g., 50.00

  @Column({ nullable: true })
  description!: string; // Optional description
}