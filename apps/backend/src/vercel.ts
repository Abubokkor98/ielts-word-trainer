import { connectToDatabase } from './config/mongo';
import { createServer } from './server';

const app = createServer();

export default async (req: any, res: any) => {
  await connectToDatabase();
  app(req, res);
};
