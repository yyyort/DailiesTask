import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema';

export function createPostgresConnection(connectionString: string) {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

export type PostgresDB = ReturnType<typeof createPostgresConnection>;