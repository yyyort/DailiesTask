import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();
const node_env = process.env.NODE_ENV;
const db_url = node_env === 'dev' ? process.env.DEV_DATABASE_URL : process.env.DATABASE_URL;

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: String(db_url),
  },
});

