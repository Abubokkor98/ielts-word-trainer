import { env } from './config/env';
import { connectToDatabase } from './config/mongo';
import { createServer } from './server';

const startServer = async () => {
  await connectToDatabase();

  const app = createServer();

  const port = env.PORT || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api/v1`);
  });

  server.on('error', console.error);
};

startServer();
