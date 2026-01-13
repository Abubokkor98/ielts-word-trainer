import { connectToDatabase } from '../src/config/mongo';
import { createServer } from '../src/server';

const app = createServer();

export default async (req: any, res: any) => {
  try {
    await connectToDatabase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (app as any)(req, res);
  } catch (error) {
    console.error('Serverless Function Error:', error);
    res
      .status(500)
      .json({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : String(error),
      });
  }
};
