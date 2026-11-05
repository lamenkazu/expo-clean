import { AppError } from '@core/error/AppError';
import { ERROR_CODES, type ErrorCode } from '@core/error/error-codes';
import { toAppError } from '@infra/shared/error/to-app-error';

// Codigos do Postgres (PostgREST) e do GoTrue que tem mensagem propria no app.
const mapCode = (code: string | undefined, fallback: ErrorCode): ErrorCode => {
  switch (code) {
    case '42501':
      return ERROR_CODES.AUTH_UNAUTHORIZED;
    case 'invalid_credentials':
      return ERROR_CODES.AUTH_INVALID_CREDENTIALS;
    case 'email_not_confirmed':
      return ERROR_CODES.AUTH_EMAIL_NOT_CONFIRMED;
    case 'user_already_exists':
      return ERROR_CODES.AUTH_USER_EXISTS;
    case 'session_expired':
    case 'refresh_token_not_found':
      return ERROR_CODES.AUTH_SESSION_EXPIRED;
    default:
      return fallback;
  }
};

const isNetworkFailure = (error: object) =>
  'name' in error && (error.name === 'AuthRetryableFetchError' || error.name === 'FetchError');

export const fromSupabaseError = (error: unknown, fallbackCode: ErrorCode): AppError => {
  if (error instanceof AppError || !error || typeof error !== 'object') {
    return toAppError(error, fallbackCode);
  }

  const code = 'code' in error && error.code ? String(error.code) : undefined;
  const message = 'message' in error ? String(error.message) : 'Supabase error';

  return new AppError({
    code: isNetworkFailure(error) ? ERROR_CODES.NETWORK_ERROR : mapCode(code, fallbackCode),
    message,
    details: 'details' in error && error.details ? String(error.details) : undefined,
    hint: 'hint' in error && error.hint ? String(error.hint) : undefined,
    cause: error,
  });
};
