import { Agenda } from 'agenda';
import { MongoBackend } from '@agendajs/mongo-backend';
import mongoose from 'mongoose';

export let agenda: Agenda;

export const initAgenda = () => {
  agenda = new Agenda({
    backend: new MongoBackend({ 
      // Agenda v6 uses 'mongo' to accept an existing MongoDB connection instance.
      // Reusing the mongoose connection is best practice and prevents DNS SRV errors.
      mongo: mongoose.connection.db, 
      collection: 'agendaJobs'
    }),
    processEvery: '1 minute',
  });

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
};

async function graceful() {
  if (agenda) {
    await agenda.stop();
  }
  process.exit(0);
}
