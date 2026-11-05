# ADR 001: Core/Infra + MVVM

## Contexto

Vem do realtime-shopping, onde separar contratos de implementações facilitou trocar o Supabase por
outro backend e testar a lógica sem o aparelho.

## Decisão

- As rotas ficam em `app/` e só reexportam a view da tela.
- `src/core` guarda DTOs, regras puras (`domain`), contratos de repositórios e serviços, e erros. Não
  importa React, Expo nem nada de `infra`.
- `src/infra` guarda as implementações: SQLite, Firebase, providers, UI e as telas de cada feature.
- Cada tela segue MVVM:
  - `model.ts`: schema, tipos, valores padrão e conversores.
  - `view-model.tsx`: estado, chamadas, navegação e erros.
  - `view.tsx`: só JSX.
- O `DependencyInjectionFactory` escolhe a implementação de cada contrato. Telas e providers nunca
  criam uma implementação direto.
- Falhas viram `AppError` com um código na borda do repositório. A mensagem para a pessoa sai do i18n.

## Consequências

- A lógica de `core` pode ir para um backend NestJS (como no template `@eppck/create-ddd`) sem mudar.
- Os view-models são testados com repositórios em memória, sem banco e sem rede.
- Não há camada de casos de uso: a orquestração fica no view-model. Se uma regra precisar rodar em mais
  de uma tela, ela vai para `core/domain`.
