import Constants from 'expo-constants';

// Prefixo das chaves do AsyncStorage. Uma mudanca aqui faz o app esquecer as preferencias salvas.
export const STORAGE_PREFIX = '@__APP_SLUG__';

export const DATABASE_NAME = '__APP_SLUG__.db';

// O app.config.js liga esta flag quando existe google-services.json.
export const isFirebaseEnabled = (): boolean =>
  Boolean(Constants.expoConfig?.extra?.firebaseEnabled);
