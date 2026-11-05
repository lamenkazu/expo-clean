import type { SignUpDTO } from '@core/dto/auth.dto';
import { emailField, passwordField } from '@infra/modules/auth/validation';
import { z } from 'zod';

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, 'auth:validation.nameMin'),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'auth:validation.passwordMismatch',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const defaultValues: SignUpFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const toDTO = (data: SignUpFormData): SignUpDTO => ({
  fullName: data.fullName.trim(),
  email: data.email.trim(),
  password: data.password,
});
