import { defineConfig } from 'drizzle-kit'
import { Resource } from 'sst';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: Resource.LIBSQL_DB_URL.value,
    authToken: Resource.LIBSQL_DB_TOKEN.value,
  },
})
