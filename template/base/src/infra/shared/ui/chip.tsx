import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import { Pressable, Text } from 'react-native';

export interface UIChipProps {
  label: string;
  isSelected?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export const UIChip = ({ label, isSelected = false, onPress, accessibilityLabel }: UIChipProps) => {
  const colors = useAppColors();
  const shape = useAppShape();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: isSelected }}
      hitSlop={4}
      className="min-h-9 justify-center px-3 py-1.5"
      style={{
        backgroundColor: isSelected ? colors.chipActiveBackground : colors.chipBackground,
        borderColor: isSelected ? colors.chipActiveBorder : colors.chipBorder,
        borderRadius: shape.chipRadius,
        borderStyle: shape.dashedControls && !isSelected ? 'dashed' : 'solid',
        borderWidth: shape.borderWidth,
      }}
    >
      <Text
        style={{ color: isSelected ? colors.chipActiveForeground : colors.chipForeground }}
        className={isSelected ? 'text-sm font-semibold' : 'text-sm'}
      >
        {label}
      </Text>
    </Pressable>
  );
};
