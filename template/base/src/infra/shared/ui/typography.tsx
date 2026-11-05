import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export interface UITitleProps {
  children: ReactNode;
  className?: string;
}

// Titulo da tela. Com highlight no tema, ganha um traco de marca-texto por tras do texto.
export const UIPageTitle = ({ children, className }: UITitleProps) => {
  const colors = useAppColors();
  const shape = useAppShape();

  return (
    <View className={`self-start ${className ?? ''}`.trim()}>
      {colors.highlight === 'transparent' ? null : (
        <View
          pointerEvents="none"
          className="absolute bottom-[3px] left-0 right-0 h-[40%]"
          style={{ backgroundColor: colors.highlight }}
        />
      )}
      <Text
        accessibilityRole="header"
        numberOfLines={1}
        style={{ color: colors.text, fontSize: shape.titleSize, lineHeight: shape.titleSize + 6 }}
        className="px-0.5 font-bold"
      >
        {children}
      </Text>
    </View>
  );
};

export const UISectionTitle = ({ children, className }: UITitleProps) => {
  const colors = useAppColors();
  const shape = useAppShape();

  return (
    <Text
      accessibilityRole="header"
      style={{
        color: colors.sectionTitle,
        letterSpacing: shape.sectionUppercase ? 0.5 : 0,
        textTransform: shape.sectionUppercase ? 'uppercase' : 'none',
      }}
      className={`pl-0.5 font-bold ${shape.sectionUppercase ? 'text-[13px]' : 'text-sm'} ${className ?? ''}`.trim()}
    >
      {children}
    </Text>
  );
};
