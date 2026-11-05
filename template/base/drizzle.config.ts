import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/infra/data/local/db/schema.ts',
  out: './src/infra/data/local/db/migrations',
});
