import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export const db = () => {
  if (!dbInstance) {
    if (!process.env.LIBSQL_DB_URL) {
      throw new Error('Database credentials not configured');
    }

    dbInstance = drizzle({
      connection: {
        url: process.env.LIBSQL_DB_URL,
        authToken: process.env.LIBSQL_DB_TOKEN,
      },
      schema,
    });
  }

  return dbInstance;
}
