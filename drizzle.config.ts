import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.LIBSQL_DB_URL as string,
    authToken: process.env.LIBSQL_DB_TOKEN,
  },
})
