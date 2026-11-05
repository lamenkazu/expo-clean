import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE, NAMESPACES, resources, SUPPORTED_LANGUAGES } from './resources';

const pickLanguage = (): string => {
  const preferred = getLocales().map(locale => locale.languageTag);
  const supported = new Set<string>(SUPPORTED_LANGUAGES);

  return preferred.find(tag => supported.has(tag)) ?? DEFAULT_LANGUAGE;
};

// Os textos ja estao no bundle, entao a inicializacao termina antes da primeira tela.
i18n.use(initReactI18next).init({
  resources,
  lng: pickLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: 'common',
  ns: NAMESPACES,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
