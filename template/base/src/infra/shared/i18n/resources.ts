import common from './locales/pt-BR/common';
import errors from './locales/pt-BR/errors';
import home from './locales/pt-BR/home';
import paywall from './locales/pt-BR/paywall';
import settings from './locales/pt-BR/settings';
import tours from './locales/pt-BR/tours';
import validation from './locales/pt-BR/validation';
// @inject:i18n-imports

export const DEFAULT_LANGUAGE = 'pt-BR';

// Para um idioma novo, crie locales/<idioma>/ com os mesmos arquivos e registre aqui.
export const SUPPORTED_LANGUAGES = [DEFAULT_LANGUAGE] as const;

export const resources = {
  'pt-BR': {
    common,
    errors,
    home,
    paywall,
    settings,
    tours,
    validation,
    // @inject:i18n-namespaces
  },
};

export type AppNamespace = keyof (typeof resources)['pt-BR'];

export const NAMESPACES = Object.keys(resources[DEFAULT_LANGUAGE]) as AppNamespace[];
