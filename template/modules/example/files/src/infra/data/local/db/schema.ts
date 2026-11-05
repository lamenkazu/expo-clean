import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Tabelas do SQLite local, uma por agregado do app. Depois de mudar este arquivo, rode
// "pnpm db:generate" para criar a migration, que entra no bundle e roda na abertura do app.
// Datas ficam em texto ISO, o mesmo formato dos DTOs.
export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull().default(''),
  isPinned: integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type NoteRow = typeof notes.$inferSelect;
