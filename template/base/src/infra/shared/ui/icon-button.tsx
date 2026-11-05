import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIIcon, type UIIconName } from '@infra/shared/ui/icon';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';

export interface UIIconButtonProps
  extends Pick<PressableProps, 'onPress' | 'disabled' | 'testID' | 'accessibilityLabel'> {
  icon: UIIconName;
  size?: 'sm' | 'md';
  tone?: 'default' | 'danger';
  containerClassName?: string;
}

const sizeClassMap = {
  sm: 'h-8 w-8 rounded-full',
  md: 'h-10 w-10 rounded-full',
} as const;

const iconSizeMap = {
  sm: 16,
  md: 20,
} as const;

export const UIIconButton = ({
  icon,
  onPress,
  disabled,
  testID,
  accessibilityLabel,
  size = 'md',
  tone = 'default',
  containerClassName,
}: UIIconButtonProps) => {
  const colors = useAppColors();

  const palette =
    tone === 'danger'
      ? {
          backgroundColor: colors.dangerSoft,
          borderColor: colors.danger,
          iconColor: colors.danger,
        }
      : {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          iconColor: colors.text,
        };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={6}
      style={{
        backgroundColor: palette.backgroundColor,
        borderColor: palette.borderColor,
        borderWidth: 1,
        opacity: disabled ? 0.6 : 1,
      }}
      className={`items-center justify-center ${sizeClassMap[size]} ${containerClassName ?? ''}`.trim()}
    >
      <UIIcon name={icon} size={iconSizeMap[size]} color={palette.iconColor} />
    </Pressable>
  );
};
