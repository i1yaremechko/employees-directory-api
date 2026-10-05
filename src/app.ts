import cors from 'cors';
import express from 'express';
import { apiRouter } from './routes';
import { notFound } from './middlewares/notFound';
import { env } from './config/env';

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use('/api', apiRouter);
app.use(notFound);
