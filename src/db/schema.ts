import {
  pgTable,
  text,
  integer,
} from 'drizzle-orm/pg-core';

export const data = pgTable('data', {
  latestMessage: text().notNull(),
  messageCount: integer().notNull(),
});
