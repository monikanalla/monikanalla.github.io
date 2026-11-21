import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import adminRouter from './routes/admin';
import publicRouter from './routes/public';
import { errorHandler, notFound } from './middleware/error';

export function createApp(): express.Express {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.isProduction ? env.corsOrigins : true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  );
  app.use(express.json({ limit: '256kb' }));

  app.use('/api/admin', adminRouter);
  app.use('/api', publicRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
