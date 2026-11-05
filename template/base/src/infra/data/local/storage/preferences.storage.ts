import { STORAGE_PREFIX } from '@infra/shared/config/app-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Preferencias pequenas (tema, tours vistos). Dados do app ficam no SQLite.
// O numero da versao entra na chave: mudar o formato de um valor exige subir a versao.
const keyOf = (name: string, version = 1) => `${STORAGE_PREFIX}/${name}:v${version}`;

export const preferencesStorage = {
  async get(name: string, version?: number): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(keyOf(name, version));
    } catch {
      // Sem leitura, o app segue com os valores padrao.
      return null;
    }
  },

  async set(name: string, value: string, version?: number): Promise<void> {
    try {
      await AsyncStorage.setItem(keyOf(name, version), value);
    } catch {
      // A tela ja mudou; so a lembranca para a proxima abertura se perde.
    }
  },

  async getJSON<T>(name: string, version?: number): Promise<T | null> {
    const raw = await preferencesStorage.get(name, version);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setJSON(name: string, value: unknown, version?: number): Promise<void> {
    await preferencesStorage.set(name, JSON.stringify(value), version);
  },

  async remove(name: string, version?: number): Promise<void> {
    try {
      await AsyncStorage.removeItem(keyOf(name, version));
    } catch {
      // Nada a fazer: o valor continua la e sera sobrescrito depois.
    }
  },
};
