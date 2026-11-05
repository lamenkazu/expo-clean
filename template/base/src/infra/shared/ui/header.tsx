import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIIconButton } from '@infra/shared/ui/icon-button';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export interface UIHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  className?: string;
}

export const UIHeader = ({ title, subtitle, onBack, rightSlot, className }: UIHeaderProps) => {
  const { t } = useTranslation();
  const colors = useAppColors();

  return (
    <View className={`mb-4 ${className ?? ''}`.trim()}>
      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          {onBack ? (
            <UIIconButton
              icon="left"
              size="md"
              onPress={onBack}
              accessibilityLabel={t('actions.back')}
            />
          ) : null}

          <View className="min-w-0 flex-1">
            <Text
              accessibilityRole="header"
              numberOfLines={1}
              style={{ color: colors.text }}
              className="text-2xl font-bold"
            >
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ color: colors.textMuted }} className="mt-0.5 text-sm">
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {rightSlot}
      </View>
    </View>
  );
};
