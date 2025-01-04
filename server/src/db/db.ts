//drizzle imports
import { drizzle } from 'drizzle-orm/node-postgres';

//dotenv
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const env = process.env.NODE_ENV ?? 'dev';

//db connection
const pool = new Pool({
    host: env === 'dev' ? 'host.docker.internal' : process.env.POSTGRES_HOST ?? 'localhost',
    user: process.env.POSTGRES_USER ?? 'user',
    password: process.env.POSTGRES_PASSWORD ?? '1234',
    database: process.env.POSTGRES_DB ?? 'dailiestask',
    port: Number(process.env.POSTGRES_PORT) ?? 5434,
})

export const db = drizzle({
    client: pool,
});

