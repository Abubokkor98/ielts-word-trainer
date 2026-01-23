import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './api.routes';
import { env } from './config/env';
import { globalErrorHandler } from './core/middleware/error.middleware';

export const createServer = (): Express => {
  const app = express();

  // Trust first proxy (required for rate limiting behind load balancers like Vercel/Dokploy)
  app.set('trust proxy', 1);
  console.log(
    '----------------------------------------------------------------'
  );
  console.log(
    `Server Request - CORS Config: ${env.CORS_ORIGINS}`
  );
  console.log(
    '----------------------------------------------------------------'
  );

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: env.CORS_ORIGINS.split(','), // Allow multiple origins from env
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'short'));
  app.use(cookieParser());

  // Cache control headers for production security and performance
  // These work WITH React Query's caching, not against it

  // Auth endpoints: NEVER cache (login state must always be fresh)
  app.use('/api/v1/auth', (_req, res, next) => {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // SRS endpoints: Very short cache (10s) - data changes after every study session
  // React Query staleTime: 2min, but invalidates on mutations
  app.use('/api/v1/srs', (_req, res, next) => {
    res.setHeader('Cache-Control', 'private, max-age=10');
    next();
  });

  // Quiz/Analytics: 1 minute cache - updates after quiz completion
  // React Query staleTime: 10min, but invalidates on quiz save
  app.use('/api/v1/quiz', (_req, res, next) => {
    res.setHeader('Cache-Control', 'private, max-age=60');
    next();
  });

  // Rate Limiting
  // const limiter = rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 minutes
  //   max: 100, // limit each IP to 100 requests per windowMs
  //   message: 'Too many requests from this IP, please try again later.',
  //   standardHeaders: true,
  //   legacyHeaders: false,
  // });
  // app.use(limiter);

  // Root Route
  app.get('/', (_req, res) => {
    res.json({
      message: 'Welcome to IELTS Vocabs API',
      status: 'running',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // Health Check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', environment: env.NODE_ENV });
  });

  // API Routes
  app.use('/api/v1', apiRoutes);

  // Global Error Handler
  app.use(globalErrorHandler);

  return app;
};
