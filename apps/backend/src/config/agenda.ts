import mongoose from 'mongoose';

// Agenda instance — only initialized when ENABLE_AGENDA=true (VPS/Render mode).
// On Vercel, this remains null and all schedule/cancel calls are safe no-ops.
let agendaInstance: import('agenda').Agenda | null = null;

export const getAgenda = () => agendaInstance;

// Proxy that safely no-ops when Agenda is not initialized (Vercel mode).
// This prevents crashes in controllers that import `agenda` at the top level.
export const agenda = {
  async schedule(...args: Parameters<import('agenda').Agenda['schedule']>) {
    if (!agendaInstance) return;
    return agendaInstance.schedule(...args);
  },
  async cancel(...args: Parameters<import('agenda').Agenda['cancel']>) {
    if (!agendaInstance) return 0;
    return agendaInstance.cancel(...args);
  },
  define(...args: Parameters<import('agenda').Agenda['define']>) {
    if (!agendaInstance) return;
    return agendaInstance.define(...args);
  },
  async start() {
    if (!agendaInstance) return;
    return agendaInstance.start();
  },
  async stop() {
    if (!agendaInstance) return;
    return agendaInstance.stop();
  },
};

export const isAgendaEnabled = () => process.env.ENABLE_AGENDA === 'true';

export const initAgenda = async () => {
  if (!isAgendaEnabled()) {
    console.log('⏭️  Agenda disabled (ENABLE_AGENDA !== "true"). Using Vercel Cron instead.');
    return;
  }

  // Dynamic import to avoid ERR_REQUIRE_ESM when compiled to CommonJS
  const agendaImport = new Function('return import("agenda")')();
  const mongoBackendImport = new Function('return import("@agendajs/mongo-backend")')();

  const { Agenda: AgendaClass } = await agendaImport;
  const { MongoBackend: MongoBackendClass } = await mongoBackendImport;

  agendaInstance = new AgendaClass({
    backend: new MongoBackendClass({
      mongo: mongoose.connection.db,
      collection: 'agendaJobs',
    }),
    processEvery: '1 minute',
  });

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
};

async function graceful() {
  if (agendaInstance) {
    await agendaInstance.stop();
  }
  process.exit(0);
}
