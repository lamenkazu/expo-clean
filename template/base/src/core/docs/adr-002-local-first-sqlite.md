# ADR 002: Local-first com SQLite e Drizzle

## Contexto

Os produtos funcionam sem conta e sem internet no MVP. Sincronizar com a nuvem é uma expansão
possível, e só faz sentido quando trouxer um benefício claro para a pessoa.

## Decisão

- Os dados do app ficam no SQLite (`expo-sqlite`), acessados pelo Drizzle.
- O esquema fica em `src/infra/data/local/db/schema.ts`. O `drizzle-kit` gera as migrations, que entram
  no bundle e rodam na abertura do app (`DatabaseGate`).
- Os ids são UUID gerados no aparelho, e as datas ficam em texto ISO. Os dois facilitam uma
  sincronização futura.
- O AsyncStorage guarda só preferências pequenas (tema, tours vistos, desbloqueios).

## Consequências

- Uma migration já gerada nunca é editada: uma mudança de esquema gera uma migration nova.
- Os repositórios SQLite implementam os contratos de `core`. Uma versão com nuvem implementa os mesmos
  contratos, e as telas não mudam.
- Os testes não usam o SQLite: usam os repositórios em memória de `test/`.
