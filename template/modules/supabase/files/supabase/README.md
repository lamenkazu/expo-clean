# Supabase

As migrations em `supabase/migrations` são a fonte da verdade do banco. Nunca edite uma migration já
aplicada: crie uma nova.

## Primeiro uso

1. Crie o projeto no painel do Supabase.
2. Copie `.env.example` para `.env` e preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_KEY`
   (chave publicável, em Project Settings > API).
3. Ligue a pasta ao projeto:

   ```bash
   pnpm dlx supabase login
   pnpm dlx supabase link --project-ref <id-do-projeto>
   ```

4. Em Authentication > URL Configuration, cadastre as URLs de redirecionamento dos e-mails:
   - com o redirecionador: `https://<seu-redirecionador>/auth/confirm` e `/auth/recovery`
   - sem ele: `__APP_SCHEME__:///sign-in` e `__APP_SCHEME__:///recovery`

## Banco de dados

```bash
pnpm dlx supabase migration new <nome>
pnpm dlx supabase db push --linked --dry-run
pnpm dlx supabase db push --linked
```

Depois de mudar o esquema, gere os tipos:

```bash
pnpm dlx supabase gen types typescript --linked > src/infra/data/supabase/database.types.ts
```

## Regras

- Habilite RLS em toda tabela nova, na mesma migration que a cria.
- O `service_role` não recebe acesso automático. Uma Edge Function que usa o cliente admin precisa de
  `grant` explícito, só no que ela usa.
- Um `update` em linha inexistente não dá erro. Se o resultado importa, use `.select()` e confira as
  linhas.
