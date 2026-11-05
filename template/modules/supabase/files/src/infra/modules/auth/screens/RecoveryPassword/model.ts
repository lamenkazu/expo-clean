import { passwordField } from '@infra/modules/auth/validation';
import { z } from 'zod';

export const recoveryPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'auth:validation.passwordMismatch',
    path: ['confirmPassword'],
  });

export type RecoveryPasswordFormData = z.infer<typeof recoveryPasswordSchema>;

export const defaultValues: RecoveryPasswordFormData = { password: '', confirmPassword: '' };

// Junta os parametros que o Expo Router entrega em um link para o repositorio ler os tokens.
export const toQueryParams = (
  params: Record<string, string | string[] | undefined>
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === 'string' && entry[1].trim().length > 0
    )
  );
