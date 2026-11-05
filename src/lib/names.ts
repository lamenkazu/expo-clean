// Deriva os identificadores do app a partir do nome da pasta.
export const toSlug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// O scheme vira parte de URLs e de intent filters do Android: so letras e numeros.
export const toScheme = (slug: string): string => slug.replace(/[^a-z0-9]/g, '');

export const toDisplayName = (slug: string): string =>
  slug
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const toAndroidPackage = (slug: string, prefix = 'com.eppck'): string => {
  const segment = toScheme(slug);
  // Um segmento de pacote Java nao pode comecar com digito.
  return `${prefix}.${/^[0-9]/.test(segment) ? `app${segment}` : segment}`;
};

const ANDROID_PACKAGE_PATTERN = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;

export const isValidAndroidPackage = (value: string): boolean =>
  ANDROID_PACKAGE_PATTERN.test(value);
