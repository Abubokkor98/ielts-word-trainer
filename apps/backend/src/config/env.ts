import path from 'node:path';
import dotenv from 'dotenv';

// Load .env from backend directory
dotenv.config({ path: path.join(process.cwd(), 'apps/backend/.env') });

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:3001';

export const env = {
  PORT: process.env.PORT || '3333',
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_DBNAME: process.env.MONGODB_DBNAME || 'ielts_app',
  JWT_SECRET: process.env.JWT_SECRET || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL,
  ADMIN_URL,
  // CORS_ORIGINS can be explicitly set, or defaults to CLIENT_URL + ADMIN_URL
  CORS_ORIGINS: process.env.CORS_ORIGINS || `${CLIENT_URL},${ADMIN_URL}`,
};
