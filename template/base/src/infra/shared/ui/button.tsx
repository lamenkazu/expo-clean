import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Pressable, Text } from 'react-native';

export type UIButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'dangerSoft'
  | 'info'
  | 'success'
  | 'warning';

export type UIButtonSize = 'md' | 'sm';

export interface UIButtonProps
  extends Pick<PressableProps, 'onPress' | 'testID' | 'accessibilityLabel'> {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  variant?: UIButtonVariant;
  size?: UIButtonSize;
  containerClassName?: string;
  labelClassName?: string;
}

const containerSizeClassMap: Record<UIButtonSize, string> = {
  md: 'px-4 py-3',
  sm: 'px-3 py-2',
};

const labelSizeClassMap: Record<UIButtonSize, string> = {
  md: 'font-semibold',
  sm: 'text-sm font-medium',
};

export const UIButton = ({
  label,
  disabled,
  loading,
  loadingLabel,
  onPress,
  testID,
  accessibilityLabel,
  variant = 'primary',
  size = 'md',
  containerClassName,
  labelClassName,
}: UIButtonProps) => {
  const colors = useAppColors();
  const shape = useAppShape();
  const isDisabled = Boolean(disabled || loading);

  const containerVariantStyleMap: Record<UIButtonVariant, StyleProp<ViewStyle>> = {
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.secondaryBackground,
      borderColor: colors.secondaryBorder,
      borderStyle: shape.dashedControls ? 'dashed' : 'solid',
      borderWidth: shape.borderWidth,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: colors.border,
      borderWidth: 1,
    },
    danger: {
      backgroundColor: colors.danger,
    },
    dangerSoft: {
      backgroundColor: shape.isFlat ? 'transparent' : colors.dangerSoft,
      borderColor: colors.danger,
      borderWidth: shape.isFlat ? shape.borderWidth : 0,
    },
    info: {
      backgroundColor: colors.info,
    },
    success: {
      backgroundColor: colors.success,
    },
    warning: {
      backgroundColor: colors.warning,
    },
  };

  const labelVariantStyleMap: Record<UIButtonVariant, StyleProp<TextStyle>> = {
    primary: { color: colors.primaryContrast },
    secondary: { color: colors.secondaryForeground },
    ghost: { color: colors.textMuted },
    danger: { color: colors.textInverse },
    dangerSoft: { color: colors.dangerContrast },
    info: { color: colors.textInverse },
    success: { color: colors.textInverse },
    warning: { color: colors.textInverse },
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: Boolean(loading) }}
      style={[
        { borderRadius: shape.buttonRadius },
        containerVariantStyleMap[variant],
        isDisabled ? { opacity: 0.6 } : null,
      ]}
      className={`${containerSizeClassMap[size]} ${containerClassName ?? ''}`.trim()}
    >
      <Text
        style={labelVariantStyleMap[variant]}
        className={`text-center ${labelSizeClassMap[size]} ${labelClassName ?? ''}`.trim()}
      >
        {loading ? (loadingLabel ?? label) : label}
      </Text>
    </Pressable>
  );
};
