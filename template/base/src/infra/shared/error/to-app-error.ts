import { AppError } from '@core/error/AppError';
import { ERROR_CODES, type ErrorCode } from '@core/error/error-codes';
import i18n from '@infra/shared/i18n';

// Usado na borda dos repositorios: qualquer falha sai como AppError com o codigo da feature.
export const toAppError = (error: unknown, fallbackCode: ErrorCode): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  const message =
    error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : 'Unexpected error';

  return new AppError({ code: fallbackCode, message, cause: error });
};

// Mensagem para a pessoa, sempre traduzida. O texto tecnico do erro nunca aparece na tela.
export const toUserMessage = (error: unknown): string => {
  const code = error instanceof AppError ? error.code : ERROR_CODES.UNKNOWN_ERROR;
  const key = `errors:${code}`;

  return i18n.exists(key) ? i18n.t(key as never) : i18n.t('errors:UNKNOWN_ERROR');
};
