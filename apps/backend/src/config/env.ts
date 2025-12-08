import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory
dotenv.config({ path: path.join(process.cwd(), 'apps/backend/.env') });

export const env = {
  PORT: process.env.PORT || '3333',
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_DBNAME: process.env.MONGODB_DBNAME || 'ielts_app',
  JWT_SECRET: process.env.JWT_SECRET || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:3333',
};
