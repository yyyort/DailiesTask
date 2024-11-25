//drizzle imports
import { drizzle } from 'drizzle-orm/node-postgres';

//dotenv
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

//db connection
const pool = new Pool({
    host: env === 'development' ? 'host.docker.internal' : 'localhost',
    user: 'user',
    password: '1234',
    database: 'dailiestask',
    port: 5434,
    ssl: false,
})

export const db = drizzle({
    client: pool,
});

