import { Pool } from 'pg';
import { env } from '../config/env';

export const pool = new Pool({ connectionString: env.databaseUrl });

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

export async function checkDbConnection(): Promise<void> {
  await pool.query('SELECT 1');
}

export async function closeDbPool(): Promise<void> {
  await pool.end();
}
