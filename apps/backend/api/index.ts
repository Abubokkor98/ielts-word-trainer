import { connectToDatabase } from '../src/config/mongo';
import { createServer } from '../src/server';

const app = createServer();

export default async (req: any, res: any) => {
  await connectToDatabase();
  app(req, res);
};
