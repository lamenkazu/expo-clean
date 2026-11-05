import type { AuthSessionDTO, AuthUserDTO } from '@core/dto/auth.dto';
import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { toUserMessage } from '@infra/shared/error/to-app-error';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// As acoes devolvem a mensagem pronta para a tela, em vez de lancar o erro.
type AuthResult = { error: string | null };

type AuthContextValue = {
  isLoading: boolean;
  session: AuthSessionDTO | null;
  user: AuthUserDTO | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<AuthResult & { needsEmailConfirmation: boolean }>;
  resetPassword: (email: string) => Promise<AuthResult>;
  handleAuthCallback: (url: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const authRepository = DependencyInjectionFactory.getInstance().getAuthRepository();

const attempt = async (action: () => Promise<unknown>): Promise<AuthResult> => {
  try {
    await action();
    return { error: null };
  } catch (error) {
    return { error: toUserMessage(error) };
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AuthSessionDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    authRepository
      .getSession()
      .then(nextSession => isMounted && setSession(nextSession))
      .catch(() => isMounted && setSession(null))
      .finally(() => isMounted && setIsLoading(false));

    const unsubscribe = authRepository.onAuthStateChange(nextSession => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      session,
      user: session?.user ?? null,
      signIn: (email, password) => attempt(() => authRepository.signIn({ email, password })),
      signUp: async (email, password, fullName) => {
        try {
          const result = await authRepository.signUp({ email, password, fullName });
          return { error: null, needsEmailConfirmation: result.needsEmailConfirmation };
        } catch (error) {
          return { error: toUserMessage(error), needsEmailConfirmation: false };
        }
      },
      resetPassword: email => attempt(() => authRepository.resetPassword({ email })),
      handleAuthCallback: url => attempt(() => authRepository.handleAuthCallback(url)),
      updatePassword: password => attempt(() => authRepository.updatePassword(password)),
      signOut: () => attempt(() => authRepository.signOut()),
    }),
    [isLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
