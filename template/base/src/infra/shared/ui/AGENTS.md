# Componentes de UI

Componentes genéricos com prefixo `UI`, arquivos em kebab-case e props tipadas (`UI<Nome>Props`).

## Regras

- `shared/ui` não conhece nenhuma feature e não tem regra de negócio. Um componente de uma feature fica
  em `modules/<feature>/components`.
- Cores vêm de `useAppColors`, e forma (cantos, bordas, se há cartões) de `useAppShape`. Use
  `useAppSurfaces` para cartões, divisórias, linhas agrupadas e barras: o tema `flat` não tem cartões e
  o `cards` não tem bordas. Não fixe cores do Tailwind, `rounded-*` ou `border` nessas áreas.
- O Tailwind (`className`) cuida de layout e espaçamento, com três limites que os testes não pegam
  (o Jest não calcula layout):
  - `className` só vale nos componentes do `react-native`. O `SafeAreaView` do safe-area-context e
    outros de terceiros ignoram a prop: passe `style` ou envolva numa `View`;
  - `px-*`/`pr-*`/`pl-*` viram `padding-inline`, que o `TextInput` do Android ignora. Recuo
    horizontal de campo vai no `style` (o `UIInput` já faz);
  - `Text` centralizado num pai `items-center` é medido no tamanho do conteúdo e pode perder a
    última palavra. Use `self-stretch` no `Text` com `text-center`.
- Textos padrão (Fechar, Cancelar, Voltar) vêm do i18n, namespace `common`.
- Ícones só pelo `UIIcon`, com nomes próprios do app. Um ícone novo entra no mapa de `icon.tsx`.
- Teste no layout invertido (RTL): `left` e `right` trocam de lado, e as setas espelham.

## Componentes

| Arquivo | Uso |
|---|---|
| `screen.tsx` | Tela com área segura. Telas com barra própria usam `bottomInset={false}`. |
| `section.tsx` | Formulário curto centralizado (login, cadastro), que acompanha o teclado. |
| `card.tsx` | Cartão com título e subtítulo opcionais. |
| `typography.tsx` | `UIPageTitle` e `UISectionTitle`. |
| `button.tsx` | Botão com variantes (`primary`, `secondary`, `ghost`, `danger`, `dangerSoft`, ...), `size` e `loading`. |
| `icon-button.tsx` | Botão só com ícone, tons `default` e `danger`. |
| `text-link-button.tsx` | Link de texto. |
| `input.tsx` | Campo com rótulo, ajuda, mensagem de erro e acessório à direita; aceita `ref` para focar. |
| `chip.tsx` | Opção compacta para filtros. |
| `pill.tsx` | Selo de estado (`success`, `warning`, `danger`, `neutral`). |
| `message.tsx` | Mensagem de erro, sucesso ou informação. |
| `toast.tsx` | Aviso temporário. Use pelo `useToast()`. |
| `modal.tsx` | Modal centralizado. |
| `confirm-dialog.tsx` | Confirmação no lugar do `Alert.alert`. |
| `bottom-sheet.tsx` | Folha inferior (ou superior com `position="top"`), atenta ao teclado. |
| `menu.tsx` | Menu de ações. |
| `swipe-tabs.tsx` | Abas que também mudam ao deslizar. Sem rolagem horizontal dentro das páginas. |
| `header.tsx` | Cabeçalho com voltar e ações à direita. |
| `icon.tsx` | `UIIcon`. |
| `theme-mode-toggle.tsx` | Escolha de tema e de modo (claro, escuro, sistema). |
| `tour-overlay.tsx` | Destaque do tour. Use pelo `TourProvider`. |

## Tours

- Os passos ficam em `src/core/domain/tours.ts`, e os textos no namespace `tours` do i18n.
- Marque a área com `UITourTarget` e abra o tour da tela com `useScreenTour(id, isReady)`.
- Cada tour abre na primeira visita e pode ser revisto em Ajustes.
