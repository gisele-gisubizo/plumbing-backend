import { DataSource } from 'typeorm';
import { PlumbingService } from '../entities/PlumbingService'; // We'll create this entity next

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Auto-create tables in dev (turn off in production)
  logging: true, // Log queries for debugging
  entities: [PlumbingService], // Add more entities here later
  migrations: [],
  subscribers: [],
});