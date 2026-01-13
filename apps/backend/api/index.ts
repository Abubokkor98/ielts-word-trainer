import { connectToDatabase } from '../src/config/mongo';
import { createServer } from '../src/server';

// Lazy init to capture startup errors
let app: any = null;

export default async (req: any, res: any) => {
  console.log('Function Invoked');

  try {
    // Log Env Vars (Sanitized)
    console.log('Environment Debug:', {
      NODE_ENV: process.env.NODE_ENV,
      HAS_MONGO_URI: !!process.env.MONGODB_URI,
      CORS_ORIGINS: process.env.CORS_ORIGINS,
    });

    if (!app) {
      console.log('Initializing Express App...');
      app = createServer();
      console.log('Express App Initialized.');
    }

    console.log('Connecting to Database...');
    await connectToDatabase();
    console.log('Database Connected.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (app as any)(req, res);
  } catch (error) {
    console.error('CRITICAL SERVERLESS ERROR:', error);

    // Attempt to send error response
    try {
      res.status(500).json({
        error: 'Serverless Function Crashed',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    } catch (innerError) {
      console.error('Failed to send error response:', innerError);
      res.end('Fatal Internal Server Error');
    }
  }
};
