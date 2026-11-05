import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import { Text, View } from 'react-native';

export type UIPillTone = 'success' | 'warning' | 'danger' | 'neutral';

export interface UIPillProps {
  label: string;
  tone: UIPillTone;
}

export const UIPill = ({ label, tone }: UIPillProps) => {
  const colors = useAppColors();
  const shape = useAppShape();
  const palette = {
    success: { background: colors.successSoft, foreground: colors.success },
    warning: { background: colors.warningSoft, foreground: colors.warning },
    danger: { background: colors.dangerSoft, foreground: colors.danger },
    neutral: { background: colors.surfaceElevated, foreground: colors.textMuted },
  }[tone];

  return (
    <View
      className="px-2 py-0.5"
      style={{
        backgroundColor: shape.pillOutlined ? 'transparent' : palette.background,
        borderColor: palette.foreground,
        borderWidth: shape.pillOutlined ? shape.borderWidth : 0,
        borderRadius: shape.chipRadius,
      }}
    >
      <Text style={{ color: palette.foreground }} className="text-xs font-bold">
        {label}
      </Text>
    </View>
  );
};
