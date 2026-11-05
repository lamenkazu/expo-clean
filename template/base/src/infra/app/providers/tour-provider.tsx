import {
  parseSeenTours,
  stepsFor,
  type TourId,
  type TourStep,
  type TourTargetId,
} from '@core/domain/tours';
import { preferencesStorage } from '@infra/data/local/storage/preferences.storage';
import { UITourOverlay, type UITourRect } from '@infra/shared/ui/tour-overlay';
import { useFocusEffect } from 'expo-router';
import {
  type ComponentRef,
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View, type ViewProps } from 'react-native';

type ViewInstance = ComponentRef<typeof View>;

const SEEN_KEY = 'tours-seen';
const START_DELAY_MS = 600;

type ActiveTour = {
  id: TourId;
  steps: { step: TourStep; rect: UITourRect | null }[];
  index: number;
};

type TourContextValue = {
  isHydrated: boolean;
  isActive: boolean;
  hasSeen: (id: TourId) => boolean;
  // Pede o tour de novo: ele comeca quando a tela dele abrir.
  replay: (id: TourId) => void;
  takeReplay: (id: TourId) => boolean;
  start: (id: TourId) => Promise<void>;
  registerTarget: (id: TourTargetId, view: ViewInstance) => () => void;
};

const TourContext = createContext<TourContextValue | null>(null);

const measure = (view: ViewInstance) =>
  new Promise<UITourRect | null>(resolve => {
    // measureInWindow desconta a barra de status no Android, e o tour cobre a tela inteira.
    view.measure((_left, _top, width, height, x, y) => {
      const screen = Dimensions.get('screen');
      const isVisible =
        width > 0 && height > 0 && y >= 0 && y < screen.height && x + width > 0 && x < screen.width;

      resolve(isVisible ? { x, y, width, height } : null);
    });
  });

export const TourProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const [seen, setSeen] = useState<Set<TourId>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);
  const [active, setActive] = useState<ActiveTour | null>(null);
  const targetsRef = useRef(new Map<TourTargetId, Set<ViewInstance>>());
  const replayRef = useRef<TourId | null>(null);

  useEffect(() => {
    let isMounted = true;

    preferencesStorage.get(SEEN_KEY).then(stored => {
      if (isMounted) {
        setSeen(parseSeenTours(stored));
        setIsHydrated(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const registerTarget = useCallback((id: TourTargetId, view: ViewInstance) => {
    const views = targetsRef.current.get(id) ?? new Set<ViewInstance>();
    views.add(view);
    targetsRef.current.set(id, views);

    return () => {
      views.delete(view);
    };
  }, []);

  // A mesma area pode existir em varias abas abertas: vale a que esta visivel.
  const measureTarget = useCallback(async (id: TourTargetId) => {
    const views = [...(targetsRef.current.get(id) ?? [])];
    const rects = await Promise.all(views.map(measure));

    return rects.find(candidate => candidate !== null) ?? null;
  }, []);

  const start = useCallback(
    async (id: TourId) => {
      const measured = await Promise.all(
        stepsFor(id).map(async step => ({
          step,
          rect: step.target ? await measureTarget(step.target) : null,
        }))
      );
      const steps = measured.filter(({ step, rect }) => rect !== null || !step.skipWithoutTarget);

      if (steps.length > 0) {
        setActive({ id, steps, index: 0 });
      }
    },
    [measureTarget]
  );

  const finish = useCallback(() => {
    if (active) {
      const next = new Set(seen).add(active.id);
      setSeen(next);
      preferencesStorage.set(SEEN_KEY, JSON.stringify([...next]));
    }

    setActive(null);
  }, [active, seen]);

  const goTo = useCallback(
    (delta: number) => {
      if (active && active.index + delta >= active.steps.length) {
        finish();
        return;
      }

      setActive(current =>
        current ? { ...current, index: Math.max(0, current.index + delta) } : current
      );
    },
    [active, finish]
  );

  const value = useMemo<TourContextValue>(
    () => ({
      isHydrated,
      isActive: active !== null,
      hasSeen: id => seen.has(id),
      replay: id => {
        replayRef.current = id;
      },
      takeReplay: id => {
        if (replayRef.current !== id) {
          return false;
        }

        replayRef.current = null;
        return true;
      },
      start,
      registerTarget,
    }),
    [active, isHydrated, registerTarget, seen, start]
  );

  const current = active?.steps[active.index];

  return (
    <TourContext.Provider value={value}>
      {children}
      {active && current ? (
        <UITourOverlay
          visible
          title={t(current.step.titleKey as never)}
          body={t(current.step.bodyKey as never)}
          rect={current.rect}
          index={active.index}
          total={active.steps.length}
          onBack={() => goTo(-1)}
          onNext={() => goTo(1)}
          onClose={finish}
        />
      ) : null}
    </TourContext.Provider>
  );
};

export const useTours = () => {
  const context = useContext(TourContext);

  if (!context) {
    throw new Error('useTours must be used within TourProvider.');
  }

  return context;
};

// Abre o tour da tela na primeira visita, ou quando a pessoa pede para rever.
export const useScreenTour = (id: TourId, isReady = true) => {
  const { hasSeen, isActive, isHydrated, start, takeReplay } = useTours();

  useFocusEffect(
    useCallback(() => {
      if (!isHydrated || !isReady || isActive) {
        return;
      }

      const timeout = setTimeout(() => {
        if (takeReplay(id) || !hasSeen(id)) {
          start(id);
        }
      }, START_DELAY_MS);

      return () => clearTimeout(timeout);
    }, [hasSeen, id, isActive, isHydrated, isReady, start, takeReplay])
  );
};

export interface UITourTargetProps extends ViewProps {
  id?: TourTargetId;
  className?: string;
}

// Marca uma area da tela que um tour pode destacar.
export const UITourTarget = ({ id, children, ...rest }: UITourTargetProps) => {
  const { registerTarget } = useTours();
  const unregisterRef = useRef<(() => void) | null>(null);

  const setRef = useCallback(
    (view: ViewInstance | null) => {
      unregisterRef.current?.();
      unregisterRef.current = view && id ? registerTarget(id, view) : null;
    },
    [id, registerTarget]
  );

  return (
    <View ref={setRef} collapsable={false} {...rest}>
      {children}
    </View>
  );
};
