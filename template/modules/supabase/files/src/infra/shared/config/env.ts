import { z } from 'zod';

// O Expo so embute no bundle as variaveis lidas pelo nome completo, por isso cada uma aparece aqui.
const schema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.url(),
  EXPO_PUBLIC_SUPABASE_KEY: z.string().min(1),
  // Site que redireciona os links dos e-mails para o app (ver deeplink-redirector/).
  EXPO_PUBLIC_AUTH_REDIRECT_BASE_URL: z.url().optional(),
});

const parsed = schema.safeParse({
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY,
  EXPO_PUBLIC_AUTH_REDIRECT_BASE_URL: process.env.EXPO_PUBLIC_AUTH_REDIRECT_BASE_URL || undefined,
});

if (!parsed.success) {
  throw new Error(
    `Variaveis do Supabase ausentes ou invalidas. Copie .env.example para .env e preencha: ${parsed.error.issues
      .map(issue => issue.path.join('.'))
      .join(', ')}`
  );
}

export const env = parsed.data;
