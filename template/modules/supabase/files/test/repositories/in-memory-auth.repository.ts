import type { AuthSessionDTO, SignInDTO, SignUpDTO, SignUpResultDTO } from '@core/dto/auth.dto';
import { AppError } from '@core/error/AppError';
import { ERROR_CODES } from '@core/error/error-codes';
import type { AuthRepository } from '@core/repositories/auth.repository';

// Contas guardadas em memoria. A senha fica em texto puro porque nunca sai do teste.
export class InMemoryAuthRepository implements AuthRepository {
  public users: { id: string; email: string; password: string }[] = [];
  public session: AuthSessionDTO | null = null;
  private listeners = new Set<(session: AuthSessionDTO | null) => void>();

  private emit() {
    for (const listener of this.listeners) {
      listener(this.session);
    }
  }

  async getSession() {
    return this.session;
  }

  onAuthStateChange(listener: (session: AuthSessionDTO | null) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async signIn({ email, password }: SignInDTO) {
    const user = this.users.find(item => item.email === email && item.password === password);

    if (!user) {
      throw new AppError({ code: ERROR_CODES.AUTH_INVALID_CREDENTIALS, message: 'invalid' });
    }

    this.session = { user: { id: user.id, email: user.email } };
    this.emit();
  }

  async signUp({ email, password }: SignUpDTO): Promise<SignUpResultDTO> {
    if (this.users.some(item => item.email === email)) {
      throw new AppError({ code: ERROR_CODES.AUTH_USER_EXISTS, message: 'exists' });
    }

    this.users.push({ id: `user-${this.users.length + 1}`, email, password });
    return { needsEmailConfirmation: true };
  }

  async resetPassword() {}

  async handleAuthCallback() {}

  async updatePassword() {}

  async signOut() {
    this.session = null;
    this.emit();
  }
}
