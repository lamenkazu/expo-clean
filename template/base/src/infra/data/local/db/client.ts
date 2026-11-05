import { DATABASE_NAME } from '@infra/shared/config/app-config';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

// Uma conexao para o app inteiro. enableChangeListener permite o useLiveQuery do Drizzle.
export const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

export const db = drizzle(expoDb, { schema });

export type AppDatabase = typeof db;
