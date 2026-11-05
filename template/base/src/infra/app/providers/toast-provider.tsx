import { UIToast, type UIToastTone } from '@infra/shared/ui/toast';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Keyboard, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOAST_DURATION_MS = 3500;
const BANNER_DURATION_MS = 6000;
const BOTTOM_GAP = 12;

type ToastState = {
  id: number;
  title?: string;
  message: string;
  tone: UIToastTone;
  onPress?: () => void;
};

type ToastContextValue = {
  showToast: (message: string, tone?: UIToastTone) => void;
  showBanner: (banner: { title?: string; message: string; onPress?: () => void }) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);
const ToastStateContext = createContext<ToastState | null>(null);

// Fica no fundo da tela e sobe junto com o teclado. Um Modal abre outra janela do Android,
// entao as folhas e os modais renderizam a propria copia para o aviso continuar visivel.
export const ToastOutlet = () => {
  const toast = useContext(ToastStateContext);
  const context = useContext(ToastContext);
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, event => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (!toast || !context) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 z-50"
      style={{
        // A altura do teclado no Android nao inclui a area da barra de gestos.
        bottom: keyboardHeight + insets.bottom + BOTTOM_GAP,
        elevation: 12,
      }}
    >
      <UIToast
        key={toast.id}
        title={toast.title}
        message={toast.message}
        tone={toast.tone}
        onClose={context.hideToast}
        onPress={
          toast.onPress
            ? () => {
                context.hideToast();
                toast.onPress?.();
              }
            : undefined
        }
      />
    </View>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setToast(null);
  }, []);

  const present = useCallback((next: Omit<ToastState, 'id'>, durationMs: number) => {
    setToast({ ...next, id: Date.now() });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, durationMs);
  }, []);

  const showToast = useCallback(
    (message: string, tone: UIToastTone = 'info') => {
      present({ message, tone }, TOAST_DURATION_MS);
    },
    [present]
  );

  const showBanner = useCallback<ToastContextValue['showBanner']>(
    banner => {
      present({ ...banner, tone: 'info' }, BANNER_DURATION_MS);
    },
    [present]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({ showToast, showBanner, hideToast }),
    [hideToast, showBanner, showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      <ToastStateContext.Provider value={toast}>
        {children}
        <ToastOutlet />
      </ToastStateContext.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
