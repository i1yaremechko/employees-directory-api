import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { employeesRouter } from './routes/employees.routes';
import { healthRouter } from './routes/health.routes';

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use('/api/employees', employeesRouter);
app.use('/api/health', healthRouter);

app.use(notFound);
app.use(errorHandler);
