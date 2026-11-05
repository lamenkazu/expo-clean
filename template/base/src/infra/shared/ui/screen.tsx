import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface UIScreenProps {
  children: ReactNode;
  centered?: boolean;
  padded?: boolean;
  // Telas com barra inferior propria deixam essa barra cuidar da area do Android.
  bottomInset?: boolean;
  className?: string;
}

export const UIScreen = ({
  children,
  centered,
  padded = true,
  bottomInset = true,
  className,
}: UIScreenProps) => {
  const colors = useAppColors();

  return (
    <SafeAreaView
      edges={bottomInset ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}
      style={{ backgroundColor: colors.background }}
      className={`flex-1 ${centered ? 'items-center justify-center' : ''} ${padded ? 'px-4 pt-5 pb-5' : ''} ${className ?? ''}`.trim()}
    >
      {children}
    </SafeAreaView>
  );
};
