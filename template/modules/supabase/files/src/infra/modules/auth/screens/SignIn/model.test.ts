import { signInSchema, toDTO, toRedirect } from './model';

describe('sign in model', () => {
  it('valida e-mail e tamanho da senha', () => {
    expect(signInSchema.safeParse({ email: 'a@b.com', password: '123456' }).success).toBe(true);
    expect(signInSchema.safeParse({ email: 'invalido', password: '123456' }).success).toBe(false);
    expect(signInSchema.safeParse({ email: 'a@b.com', password: '123' }).success).toBe(false);
  });

  it('remove espacos do e-mail', () => {
    expect(toDTO({ email: ' a@b.com ', password: 'x' }).email).toBe('a@b.com');
  });

  it('aceita so redirecionamentos internos', () => {
    expect(toRedirect('/settings')).toBe('/settings');
    expect(toRedirect('//evil.com')).toBe('/');
    expect(toRedirect('https://evil.com')).toBe('/');
    expect(toRedirect(undefined)).toBe('/');
  });
});
