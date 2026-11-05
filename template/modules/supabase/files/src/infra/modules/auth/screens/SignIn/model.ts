import type { SignInDTO } from '@core/dto/auth.dto';
import { emailField, passwordField } from '@infra/modules/auth/validation';
import type { Href } from 'expo-router';
import { z } from 'zod';

export const signInSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const defaultValues: SignInFormData = { email: '', password: '' };

export const toDTO = (data: SignInFormData): SignInDTO => ({
  email: data.email.trim(),
  password: data.password,
});

// So aceita caminhos internos, para um link externo nao virar destino depois do login.
export const toRedirect = (value: string | string[] | undefined): Href => {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.startsWith('/') && !raw.startsWith('//') ? (raw as Href) : '/';
};
