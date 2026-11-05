import { z } from 'zod';

export const PASSWORD_MIN = 6;

// As mensagens sao chaves do i18n. A view traduz com translateFieldError.
export const emailField = z.email('validation:email');
export const passwordField = z.string().min(PASSWORD_MIN, 'validation:minLength');

export const translateFieldError = (
  t: (key: never, options?: Record<string, unknown>) => string,
  message: string | undefined
): string | undefined => (message ? t(message as never, { min: PASSWORD_MIN }) : undefined);
