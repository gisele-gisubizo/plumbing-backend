import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Plumber {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  specialization!: string; // e.g., "Pipe Repair", "Water Heater", "Drain Cleaning"

  @Column({ nullable: true })
  experience!: string; // e.g., "5 years"

  @Column({ nullable: true })
  location!: string; // e.g., "Kigali, Rwanda"

  @Column({ default: true })
  available!: boolean;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  rating!: number; // e.g., 4.5

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
