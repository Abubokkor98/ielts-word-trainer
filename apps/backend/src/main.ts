import { createServer } from './server';
import { connectToDatabase } from './config/mongo';
import { env } from './config/env';

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
