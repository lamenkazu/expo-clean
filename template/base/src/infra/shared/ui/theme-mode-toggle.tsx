import type { ThemeModePreference } from '@infra/app/providers/theme-provider';
import { APP_THEME_NAMES, type AppThemeName } from '@infra/shared/theme/theme';
import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UIChip } from '@infra/shared/ui/chip';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export interface UIThemeModeToggleProps {
  modePreference: ThemeModePreference;
  onChangeMode: (preference: ThemeModePreference) => void;
  themeName: AppThemeName;
  onChangeTheme: (themeName: AppThemeName) => void;
  className?: string;
}

const MODE_OPTIONS: ThemeModePreference[] = ['light', 'dark', 'system'];

export const UIThemeModeToggle = ({
  modePreference,
  onChangeMode,
  themeName,
  onChangeTheme,
  className,
}: UIThemeModeToggleProps) => {
  const { t } = useTranslation('settings');
  const colors = useAppColors();

  return (
    <View className={`gap-3 ${className ?? ''}`.trim()}>
      {APP_THEME_NAMES.length > 1 ? (
        <View className="gap-1.5">
          <Text style={{ color: colors.textMuted }} className="text-sm font-medium">
            {t('theme.label')}
          </Text>
          <View className="flex-row flex-wrap gap-1.5">
            {APP_THEME_NAMES.map(name => (
              <UIChip
                key={name}
                label={t(`theme.options.${name}`)}
                isSelected={name === themeName}
                onPress={() => onChangeTheme(name)}
              />
            ))}
          </View>
          <Text style={{ color: colors.textMuted }} className="text-xs">
            {t(`theme.hints.${themeName}`)}
          </Text>
        </View>
      ) : null}

      <View className="gap-1.5">
        <Text style={{ color: colors.textMuted }} className="text-sm font-medium">
          {t('theme.mode')}
        </Text>
        <View className="flex-row gap-2">
          {MODE_OPTIONS.map(option => (
            <UIButton
              key={option}
              label={t(`theme.${option}`)}
              size="sm"
              variant={modePreference === option ? 'primary' : 'secondary'}
              onPress={() => onChangeMode(option)}
              containerClassName="flex-1"
            />
          ))}
        </View>
      </View>
    </View>
  );
};
