// Areas da tela que um tour pode destacar. Marque cada uma com UITourTarget.
export type TourTargetId =
  | 'tab.home'
  | 'tab.settings'
  // @inject:tour-targets
  | 'settings.theme';

export type TourId =
  | 'start'
  // @inject:tour-ids
  | 'settings';

export interface TourStep {
  // Chaves do i18n, no namespace tours.
  titleKey: string;
  bodyKey: string;
  // Sem alvo, o passo aparece no centro da tela.
  target?: TourTargetId;
  // Some quando o alvo nao esta na tela. Sem isso, o passo aparece no centro.
  skipWithoutTarget?: boolean;
}

export interface Tour {
  id: TourId;
  labelKey: string;
  steps: TourStep[];
}

export const TOURS: Tour[] = [
  {
    id: 'start',
    labelKey: 'tours:start.label',
    steps: [
      { titleKey: 'tours:start.welcome.title', bodyKey: 'tours:start.welcome.body' },
      {
        target: 'tab.home',
        titleKey: 'tours:start.home.title',
        bodyKey: 'tours:start.home.body',
      },
      {
        target: 'tab.settings',
        titleKey: 'tours:start.settings.title',
        bodyKey: 'tours:start.settings.body',
      },
    ],
  },
  // @inject:tours
  {
    id: 'settings',
    labelKey: 'tours:settings.label',
    steps: [
      {
        target: 'settings.theme',
        skipWithoutTarget: true,
        titleKey: 'tours:settings.theme.title',
        bodyKey: 'tours:settings.theme.body',
      },
    ],
  },
];

export const stepsFor = (tourId: TourId): TourStep[] =>
  TOURS.find(tour => tour.id === tourId)?.steps ?? [];

export const parseSeenTours = (stored: string | null): Set<TourId> => {
  if (!stored) {
    return new Set();
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    const known = new Set<string>(TOURS.map(tour => tour.id));

    return new Set(
      Array.isArray(parsed)
        ? parsed.filter((id): id is TourId => typeof id === 'string' && known.has(id))
        : []
    );
  } catch {
    return new Set();
  }
};
