import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import { Pool } from 'pg';

const nodeEnv = process.env.NODE_ENV;

const pool = new Pool({
    connectionString: nodeEnv === 'dev' ? process.env.DEV_DATABASE_URL : process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool });