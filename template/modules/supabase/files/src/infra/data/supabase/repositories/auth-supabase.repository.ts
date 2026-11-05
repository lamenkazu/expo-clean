import type {
  AuthSessionDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
  SignUpResultDTO,
} from '@core/dto/auth.dto';
import { ERROR_CODES } from '@core/error/error-codes';
import type { AuthRepository } from '@core/repositories/auth.repository';
import { supabase } from '@infra/data/supabase/client';
import { fromSupabaseError } from '@infra/data/supabase/error/from-supabase-error';
import { env } from '@infra/shared/config/env';
import type { EmailOtpType, Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

const mapSession = (session: Session | null): AuthSessionDTO | null =>
  session ? { user: { id: session.user.id, email: session.user.email ?? null } } : null;

// Os links dos e-mails passam pelo redirecionador (https), que abre o app pelo scheme.
// Sem ele, o link aponta direto para o scheme, o que alguns clientes de e-mail bloqueiam.
const redirectUrl = (redirectPath: string, appPath: string, queryParams?: Record<string, string>) => {
  const base = env.EXPO_PUBLIC_AUTH_REDIRECT_BASE_URL?.replace(/\/+$/, '');
  return base ? `${base}${redirectPath}` : Linking.createURL(appPath, { queryParams });
};

const parseAuthParams = (url: string): URLSearchParams => {
  const params = new URLSearchParams();
  const [withoutHash = '', hash = ''] = url.split('#');
  const [, query = ''] = withoutHash.split('?');

  for (const raw of [query, hash]) {
    new URLSearchParams(raw).forEach((value, key) => {
      params.set(key, value);
    });
  }

  return params;
};

export class AuthSupabaseRepository implements AuthRepository {
  async getSession(): Promise<AuthSessionDTO | null> {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw fromSupabaseError(error, ERROR_CODES.AUTH_UNKNOWN);
    }

    return mapSession(data.session);
  }

  onAuthStateChange(listener: (session: AuthSessionDTO | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      listener(mapSession(session));
    });

    return () => data.subscription.unsubscribe();
  }

  async signIn(credentials: SignInDTO): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      throw fromSupabaseError(error, ERROR_CODES.AUTH_INVALID_CREDENTIALS);
    }
  }

  async signUp(data: SignUpDTO): Promise<SignUpResultDTO> {
    const { data: response, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl('/auth/confirm', '/sign-in', { confirmed: '1' }),
        data: { full_name: data.fullName?.trim() || null },
      },
    });

    if (error) {
      throw fromSupabaseError(error, ERROR_CODES.AUTH_UNKNOWN);
    }

    return { needsEmailConfirmation: !response.session };
  }

  async resetPassword(data: ResetPasswordDTO): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: redirectUrl('/auth/recovery', '/recovery'),
    });

    if (error) {
      throw fromSupabaseError(error, ERROR_CODES.AUTH_UNKNOWN);
    }
  }

  async handleAuthCallback(url: string): Promise<void> {
    const params = parseAuthParams(url);
    const code = params.get('code');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const tokenHash = params.get('token_hash');
    const otpType = params.get('type');

    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : accessToken && refreshToken
        ? await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        : tokenHash && otpType
          ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType as EmailOtpType })
          : { error: { code: 'invalid_link', message: 'Invalid or expired auth link' } };

    if (error) {
      throw fromSupabaseError(error, ERROR_CODES.AUTH_INVALID_LINK);
    }
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw fromSupabaseError(error, ERROR_CODES.AUTH_UNKNOWN);
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw fromSupabaseError(error, ERROR_CODES.AUTH_UNKNOWN);
    }
  }
}
