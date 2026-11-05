import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@infra/app/providers/auth-provider';
import { useToast } from '@infra/app/providers/toast-provider';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { defaultValues, type SignUpFormData, signUpSchema, toDTO } from './model';

export const useSignUpViewModel = () => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
    mode: 'onChange',
  });

  const submit = useCallback(
    async (data: SignUpFormData) => {
      const dto = toDTO(data);
      setError(null);

      const result = await signUp(dto.email, dto.password, dto.fullName);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.needsEmailConfirmation) {
        showToast(t('signUp.checkEmail'), 'success');
        router.replace('/sign-in');
        return;
      }

      router.replace('/');
    },
    [router, showToast, signUp, t]
  );

  const actions = useMemo(
    () => ({
      submit,
      resetError: () => setError(null),
      goToSignIn: () => router.replace('/sign-in'),
    }),
    [router, submit]
  );

  return { form, error, actions };
};
