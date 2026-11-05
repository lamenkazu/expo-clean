import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@infra/app/providers/auth-provider';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  defaultValues,
  type RecoveryPasswordFormData,
  recoveryPasswordSchema,
  toQueryParams,
} from './model';

type ViewModelState = {
  callbackError: string | null;
  error: string | null;
  isPreparing: boolean;
  success: string | null;
};

export const useRecoveryPasswordViewModel = () => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();
  const incomingUrl = Linking.useLinkingURL();
  const didProcessRef = useRef(false);
  const { handleAuthCallback, signOut, updatePassword } = useAuth();
  const [state, setState] = useState<ViewModelState>({
    callbackError: null,
    error: null,
    isPreparing: true,
    success: null,
  });

  const form = useForm<RecoveryPasswordFormData>({
    resolver: zodResolver(recoveryPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const callbackUrl = useMemo(() => {
    if (incomingUrl) {
      return incomingUrl;
    }

    const queryParams = toQueryParams(params);
    return Object.keys(queryParams).length > 0
      ? Linking.createURL('/recovery', { queryParams })
      : null;
  }, [incomingUrl, params]);

  // O link do e-mail traz os tokens: a sessao abre antes de a pessoa digitar a nova senha.
  useEffect(() => {
    if (didProcessRef.current) {
      return;
    }

    if (!callbackUrl) {
      setState(prev => ({ ...prev, callbackError: t('recovery.invalidLink'), isPreparing: false }));
      return;
    }

    didProcessRef.current = true;

    handleAuthCallback(callbackUrl).then(result => {
      setState(prev => ({ ...prev, callbackError: result.error, isPreparing: false }));
    });
  }, [callbackUrl, handleAuthCallback, t]);

  const submit = useCallback(
    async (data: RecoveryPasswordFormData) => {
      setState(prev => ({ ...prev, error: null, success: null }));
      const result = await updatePassword(data.password);

      setState(prev => ({
        ...prev,
        error: result.error,
        success: result.error ? null : t('recovery.updated'),
      }));
    },
    [t, updatePassword]
  );

  const goToSignIn = useCallback(async () => {
    await signOut();
    router.replace('/sign-in');
  }, [router, signOut]);

  const actions = useMemo(
    () => ({
      submit,
      goToSignIn,
      resetMessages: () => setState(prev => ({ ...prev, error: null, success: null })),
    }),
    [goToSignIn, submit]
  );

  return {
    form,
    state,
    canSubmit: !state.isPreparing && !state.callbackError,
    actions,
  };
};
