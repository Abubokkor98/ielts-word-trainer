import type { Agenda } from 'agenda';
import mongoose from 'mongoose';

export let agenda: Agenda;

export const initAgenda = async () => {
  // Use `new Function` to bypass the TypeScript compiler transforming `import()` to `require()`
  // since tsconfig is set to CommonJS. This avoids the ERR_REQUIRE_ESM runtime crash.
  const agendaImport = new Function('return import("agenda")')();
  const mongoBackendImport = new Function('return import("@agendajs/mongo-backend")')();

  const { Agenda: AgendaClass } = await agendaImport;
  const { MongoBackend: MongoBackendClass } = await mongoBackendImport;

  agenda = new AgendaClass({
    backend: new MongoBackendClass({ 
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
