import { Router } from 'express';
import { checkDbConnection } from '../db/pool';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const base = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  try {
    await checkDbConnection();
    res.json({ status: 'ok', database: 'up', ...base });
  } catch {
    res.status(503).json({ status: 'error', database: 'down', ...base });
  }
});
