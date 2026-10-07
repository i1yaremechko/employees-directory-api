import { app } from './app';
import { env } from './config/env';
import { checkDbConnection, closeDbPool } from './db/pool';

async function start(): Promise<void> {
  await checkDbConnection();
  console.log('Connected to PostgreSQL');

  const server = app.listen(env.port, () => {
    console.log(`API is running on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  function shutdown(signal: string): void {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await closeDbPool();
      process.exit(0);
    });
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  console.error('Failed to start the server:', error);
  process.exit(1);
});
