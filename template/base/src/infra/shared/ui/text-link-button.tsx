import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { PressableProps } from 'react-native';
import { Pressable, Text } from 'react-native';

export interface UITextLinkButtonProps
  extends Pick<PressableProps, 'onPress' | 'disabled' | 'testID'> {
  label: string;
  align?: 'left' | 'center' | 'right';
  containerClassName?: string;
  labelClassName?: string;
}

const alignClassMap: Record<NonNullable<UITextLinkButtonProps['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const UITextLinkButton = ({
  label,
  align = 'left',
  onPress,
  disabled,
  testID,
  containerClassName,
  labelClassName,
}: UITextLinkButtonProps) => {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="link"
      className={containerClassName}
    >
      <Text
        style={{ color: colors.primaryStrong }}
        className={`font-medium underline ${alignClassMap[align]} ${labelClassName ?? ''}`.trim()}
      >
        {label}
      </Text>
    </Pressable>
  );
};
