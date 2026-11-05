import type { TourTargetId } from '@core/domain/tours';
import type { UIIconName } from '@infra/shared/ui/icon';

export interface MainTab {
  // Nome do arquivo da rota em app/(main).
  route: string;
  labelKey: `tabs.${string}`;
  icon: UIIconName;
  target?: TourTargetId;
}

// Ordem das abas na barra inferior. Cada aba precisa de um arquivo em app/(main).
export const MAIN_TABS: MainTab[] = [
  { route: 'index', labelKey: 'tabs.home', icon: 'home', target: 'tab.home' },
  // @inject:main-tabs
  { route: 'settings', labelKey: 'tabs.settings', icon: 'settings', target: 'tab.settings' },
];
