# Redirecionador de links

Alguns clientes de e-mail não abrem links com o scheme do app (`__APP_SCHEME__://`). Este projeto
estático na Vercel recebe o link `https` do e-mail e redireciona para o app. O token de acesso viaja
no fragmento (`#...`), que o navegador mantém no redirecionamento.

## Publicar

Este diretório vira um projeto próprio na Vercel, sem build:

```bash
cd deeplink-redirector
pnpm dlx vercel --prod
```

Depois, coloque a URL publicada em `EXPO_PUBLIC_AUTH_REDIRECT_BASE_URL` no `.env` e cadastre
`<url>/auth/confirm` e `<url>/auth/recovery` nas URLs de redirecionamento do Supabase.

Para um link novo (convite, por exemplo), acrescente uma regra em `vercel.json` e a rota
correspondente em `app/`.
