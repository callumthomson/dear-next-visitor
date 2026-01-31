import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const db = drizzle({
  connection: {
    url: process.env.LIBSQL_DB_URL as string,
    authToken: process.env.LIBSQL_DB_TOKEN as string,
  },
  schema,
});
