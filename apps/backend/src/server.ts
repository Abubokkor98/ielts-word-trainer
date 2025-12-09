import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import apiRoutes from './api.routes';
import { globalErrorHandler } from './core/middleware/error.middleware';

import rateLimit from 'express-rate-limit';

export const createServer = (): Express => {
  const app = express();
  console.log(
    '----------------------------------------------------------------'
  );
  console.log(
    'Server Request - CORS Config: http://localhost:3000, http://localhost:3001'
  );
  console.log(
    '----------------------------------------------------------------'
  );

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow frontend & admin
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'short'));
  app.use(cookieParser());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Health Check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: env.NODE_ENV });
  });

  // API Routes
  app.use('/api/v1', apiRoutes);

  // Global Error Handler
  app.use(globalErrorHandler);

  return app;
};
