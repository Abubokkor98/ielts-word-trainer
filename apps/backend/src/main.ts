import { env } from './config/env';
import { connectToDatabase } from './config/mongo';
import { createServer } from './server';
import { agenda, initAgenda } from './config/agenda';
import { defineEmailJobs } from './jobs';

const startServer = async () => {
  await connectToDatabase();

  const app = createServer();

  const port = env.PORT || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api/v1`);
  });

  server.on('error', console.error);

  try {
    initAgenda();
    defineEmailJobs();
    await agenda.start();
    console.log('Agenda job scheduler started');
  } catch (error) {
    console.error('Failed to start Agenda job scheduler:', error);
    server.close();
    process.exit(1);
  }
};

void startServer();
