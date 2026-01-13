import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Service } from "./Service";
import { Plumber } from "./Plumber";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relationship to User (Customer who made the booking)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "customerId" })
  customer!: User;

  @Column()
  customerId!: string;

  // Relationship to Service (What service they want)
  @ManyToOne(() => Service, { eager: true })
  @JoinColumn({ name: "serviceId" })
  service!: Service;

  @Column()
  serviceId!: number;

  // Relationship to Plumber (Assigned plumber - can be null initially)
  @ManyToOne(() => Plumber, { eager: true, nullable: true })
  @JoinColumn({ name: "plumberId" })
  plumber!: Plumber | null;

  @Column({ nullable: true })
  plumberId!: string | null;

  // Booking details
  @Column()
  scheduledDate!: Date;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "text", nullable: true })
  description!: string; // Additional notes/details from customer

  @Column({ default: "pending" })
  status!: string; // "pending", "confirmed", "in-progress", "completed", "cancelled"

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  estimatedPrice!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  finalPrice!: number; // Actual price after service completion

  @Column({ nullable: true })
  priority!: string; // "low", "medium", "high", "emergency"

  @Column({ type: "text", nullable: true })
  adminNotes!: string; // Internal notes for admin

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
