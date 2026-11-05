import type { TourId } from '@core/domain/tours';
import type { Href } from 'expo-router';

// Tela em que cada tour comeca. O tour abre quando a tela recebe o foco.
export const TOUR_ROUTES: Record<TourId, Href> = {
  start: '/',
  // @inject:tour-routes
  settings: '/settings',
};

export const toVersionLabel = ({
  version,
  updateId,
  isEmbeddedLaunch,
}: {
  version: string | undefined;
  updateId: string | null | undefined;
  isEmbeddedLaunch: boolean;
}): { version: string; update: string | null } => ({
  version: version ?? '-',
  // O APK tambem tem um id proprio: so uma atualizacao baixada mostra o id.
  update: isEmbeddedLaunch || !updateId ? null : updateId.slice(0, 8),
});
