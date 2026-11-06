import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface UIScreenProps {
  children: ReactNode;
  centered?: boolean;
  padded?: boolean;
  // Telas com barra inferior propria deixam essa barra cuidar da area do Android.
  bottomInset?: boolean;
  className?: string;
  testID?: string;
}

export const UIScreen = ({
  children,
  centered,
  padded = true,
  bottomInset = true,
  className,
  testID,
}: UIScreenProps) => {
  const colors = useAppColors();

  // O react-native-css so le className dos componentes do react-native: o SafeAreaView do
  // safe-area-context ignora a prop. Por isso ele so recebe style, e as classes vao na View.
  return (
    <SafeAreaView
      edges={bottomInset ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View
        testID={testID}
        className={`flex-1 ${centered ? 'items-center justify-center' : ''} ${padded ? 'px-4 pt-5 pb-5' : ''} ${className ?? ''}`.trim()}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};
