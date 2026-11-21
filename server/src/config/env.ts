import dotenv from 'dotenv';
import { z } from 'zod';

// Locally the project's own server/.env is authoritative, so a stray shell
// variable (some terminals export PORT=0) cannot silently override it.
// In production there is no .env file and process.env is used as-is.
dotenv.config({ override: process.env.NODE_ENV !== 'production' });

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/hair5s'),
  JWT_SECRET: z.string().min(16).default('dev-only-insecure-secret-change-me'),
  JWT_EXPIRES_IN: z.string().default('12h'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  PUBLIC_SITE_URL: z.string().default('http://localhost:5173'),
  ADMIN_EMAIL: z.string().default('admin@hair5s.local'),
  ADMIN_PASSWORD: z.string().min(6).default('ChangeMe123!'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  corsOrigins: parsed.data.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
