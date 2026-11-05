import type {
  AuthSessionDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
  SignUpResultDTO,
} from '@core/dto/auth.dto';

export interface AuthRepository {
  getSession(): Promise<AuthSessionDTO | null>;
  onAuthStateChange(listener: (session: AuthSessionDTO | null) => void): () => void;
  signIn(credentials: SignInDTO): Promise<void>;
  signUp(data: SignUpDTO): Promise<SignUpResultDTO>;
  resetPassword(data: ResetPasswordDTO): Promise<void>;
  // Recebe o link do e-mail (confirmacao ou recuperacao) e abre a sessao.
  handleAuthCallback(url: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  signOut(): Promise<void>;
}
