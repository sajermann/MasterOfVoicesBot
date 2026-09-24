import { resolve } from 'node:path';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: resolve(process.cwd(), `.env.${env}`), quiet: true });
dotenv.config({ path: resolve(process.cwd(), '.env'), quiet: true });
