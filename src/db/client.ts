import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const db = drizzle({
  connection: process.env.DATABASE_URL as string,
  schema,
});
