import {
  sqliteTable,
  text,
  integer,
} from 'drizzle-orm/sqlite-core';

export const data = sqliteTable('data', {
  latestMessage: text().notNull(),
  messageCount: integer().notNull(),
});
