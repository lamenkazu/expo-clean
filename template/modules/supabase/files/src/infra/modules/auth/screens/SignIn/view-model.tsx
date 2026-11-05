import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@infra/app/providers/auth-provider';
import { useToast } from '@infra/app/providers/toast-provider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { defaultValues, type SignInFormData, signInSchema, toDTO, toRedirect } from './model';

export const useSignInViewModel = () => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string; confirmed?: string }>();
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const hasShownConfirmationRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues,
    mode: 'onChange',
  });

  // O link de confirmacao do e-mail volta para esta tela com confirmed=1.
  useEffect(() => {
    if (params.confirmed === '1' && !hasShownConfirmationRef.current) {
      hasShownConfirmationRef.current = true;
      showToast(t('signIn.confirmed'), 'success');
    }
  }, [params.confirmed, showToast, t]);

  const submit = useCallback(
    async (data: SignInFormData) => {
      const dto = toDTO(data);
      setError(null);

      const result = await signIn(dto.email, dto.password);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.replace(toRedirect(params.redirect));
    },
    [params.redirect, router, signIn]
  );

  const actions = useMemo(
    () => ({
      submit,
      resetError: () => setError(null),
      goToSignUp: () => router.push('/sign-up'),
      goToForgotPassword: () => router.push('/forgot-password'),
    }),
    [router, submit]
  );

  return { form, error, actions };
};
