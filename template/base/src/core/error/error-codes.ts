// Cada feature tem um prefixo proprio (NOTES_*, AUTH_*). A mensagem para a pessoa vem do i18n, na
// chave errors.<CODIGO>; o message do AppError fica para os registros.
export const ERROR_CODES = {
  DATABASE_UNKNOWN: 'DATABASE_UNKNOWN',
  STORAGE_UNKNOWN: 'STORAGE_UNKNOWN',

  ENTITLEMENTS_UNKNOWN: 'ENTITLEMENTS_UNKNOWN',
  PURCHASE_FAILED: 'PURCHASE_FAILED',
  ADS_UNAVAILABLE: 'ADS_UNAVAILABLE',

  // @inject:error-codes
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
