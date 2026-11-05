import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@infra/app/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { defaultValues, type ForgotPasswordFormData, forgotPasswordSchema, toDTO } from './model';

type ViewModelState = { error: string | null; success: string | null };

export const useForgotPasswordViewModel = () => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [state, setState] = useState<ViewModelState>({ error: null, success: null });

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const submit = useCallback(
    async (data: ForgotPasswordFormData) => {
      setState({ error: null, success: null });
      const { error } = await resetPassword(toDTO(data).email);

      setState(error ? { error, success: null } : { error: null, success: t('forgot.sent') });
    },
    [resetPassword, t]
  );

  const actions = useMemo(
    () => ({
      submit,
      resetMessages: () => setState({ error: null, success: null }),
      goToSignIn: () => router.replace('/sign-in'),
    }),
    [router, submit]
  );

  return { form, state, actions };
};
