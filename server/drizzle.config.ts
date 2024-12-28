import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    user: 'user',
    password: '1234',
    database: 'dailiestask',
    port: 5434,
    ssl: false,
  },
});
