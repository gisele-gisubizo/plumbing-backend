import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price!: number; // Estimated price in RWF

  @Column({ nullable: true })
  duration!: string; // e.g., "2 hours", "1-3 days"

  @Column({ nullable: true })
  category!: string; // e.g., "Emergency", "Maintenance", "Installation", "Repair"

  @Column({ default: true })
  isActive!: boolean; // Is this service still offered?

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
