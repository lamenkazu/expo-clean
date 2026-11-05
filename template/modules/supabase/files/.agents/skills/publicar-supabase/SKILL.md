---
name: publicar-supabase
description: Aplica migrations e publica Edge Functions do __APP_NAME__ no Supabase. Use ao criar ou alterar uma migration, ao mudar supabase/functions, ou ao pedir para atualizar o banco ou as funções.
---

# Publicar no Supabase

O projeto ligado pode ser o de produção. **Peça confirmação antes de aplicar uma migration, publicar
uma função ou alterar dados.** Consultas de leitura não precisam.

## Migrations

1. Crie um arquivo novo em `supabase/migrations/`. Nunca edite uma migration já aplicada.
2. Veja o que está pendente e o que seria aplicado:

   ```bash
   pnpm dlx supabase migration list --linked
   pnpm dlx supabase db push --linked --dry-run
   ```

3. Se a migration quebra a versão instalada do app, combine o momento com a pessoa. Veja `atualizar-app`.
4. Com a confirmação da pessoa, aplique e confira:

   ```bash
   pnpm dlx supabase db push --linked --yes
   pnpm dlx supabase migration list --linked
   ```

5. Regenere `src/infra/data/supabase/database.types.ts` se o esquema mudou.

Se a permissão desta sessão bloquear o comando, não procure outro caminho. Peça para a pessoa rodar
`pnpm dlx supabase db push` e explique o que será aplicado.

## Edge Functions

```bash
pnpm dlx supabase functions deploy <nome> --use-api
```

Chaves de serviços externos são configuradas pela própria pessoa, com `pnpm dlx supabase secrets set`.
Nunca peça nem mostre o valor de uma chave.

## Cuidados

- Toda tabela nova tem RLS habilitado na mesma migration.
- O `service_role` não recebe acesso automático às tabelas. Toda função que usa o cliente admin precisa
  de um `grant` explícito em uma migration, só no que ela usa.
- Em uma função, trate o `error` de cada consulta. Sem permissão, ignorar o erro faz parecer que não há
  dados.
- Um `update` em linha inexistente não dá erro. Se o resultado importa, use `.select()` e confira se
  alguma linha mudou.
- Antes de apagar dados: exporte uma cópia, confira os ids e use uma transação que desfaça tudo se uma
  contagem divergir.
