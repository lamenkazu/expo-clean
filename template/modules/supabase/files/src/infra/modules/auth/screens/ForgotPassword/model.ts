import type { ResetPasswordDTO } from '@core/dto/auth.dto';
import { emailField } from '@infra/modules/auth/validation';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({ email: emailField });

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const defaultValues: ForgotPasswordFormData = { email: '' };

export const toDTO = (data: ForgotPasswordFormData): ResetPasswordDTO => ({
  email: data.email.trim(),
});
