import { UITourTarget } from '@infra/app/providers/tour-provider';
import { useAppColors, useAppSurfaces } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UIChip } from '@infra/shared/ui/chip';
import { UIScreen } from '@infra/shared/ui/screen';
import { UIThemeModeToggle } from '@infra/shared/ui/theme-mode-toggle';
import { UIPageTitle, UISectionTitle } from '@infra/shared/ui/typography';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useSettingsViewModel } from './view-model';

// @inject:settings-imports

const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  const surfaces = useAppSurfaces();

  return (
    <View className="gap-2">
      <UISectionTitle>{title}</UISectionTitle>
      <View className="gap-3 p-4" style={surfaces.card}>
        {children}
      </View>
    </View>
  );
};

export const SettingsView = () => {
  const { t } = useTranslation('settings');
  const colors = useAppColors();
  const { modePreference, themeName, isPro, isRestoring, isDev, tours, versionLabel, actions } =
    useSettingsViewModel();

  return (
    <UIScreen padded={false} bottomInset={false}>
      <ScrollView contentContainerClassName="gap-4 p-4">
        <UIPageTitle>{t('title')}</UIPageTitle>

        {/* @inject:settings-sections */}

        <Section title={t('sections.plan')}>
          <Text style={{ color: colors.textMuted }} className="text-sm">
            {isPro ? t('plan.pro') : t('plan.free')}
          </Text>
          {isPro ? null : <UIButton label={t('plan.upgrade')} onPress={actions.openPaywall} />}
          <UIButton
            label={t('plan.restore')}
            variant="secondary"
            loading={isRestoring}
            onPress={actions.restore}
          />
        </Section>

        <UITourTarget id="settings.theme">
          <Section title={t('sections.appearance')}>
            <UIThemeModeToggle
              modePreference={modePreference}
              onChangeMode={actions.setModePreference}
              themeName={themeName}
              onChangeTheme={actions.setThemeName}
            />
          </Section>
        </UITourTarget>

        <Section title={t('sections.tours')}>
          <Text style={{ color: colors.textMuted }} className="text-[13px]">
            {t('tours.hint')}
          </Text>
          <View className="flex-row flex-wrap gap-1.5">
            {tours.map(tour => (
              <UIChip
                key={tour.id}
                label={t(tour.labelKey as never)}
                onPress={() => actions.replayTour(tour.id)}
              />
            ))}
          </View>
        </Section>

        {isDev ? (
          <Section title={t('sections.developer')}>
            <Text style={{ color: colors.textMuted }} className="text-[13px]">
              {t('developer.hint')}
            </Text>
            <UIButton
              label={t('developer.togglePro')}
              variant="secondary"
              onPress={actions.devTogglePro}
            />
            <UIButton
              label={t('developer.resetUnlocks')}
              variant="secondary"
              onPress={actions.devResetUnlocks}
            />
          </Section>
        ) : null}

        <Text style={{ color: colors.textMuted }} className="text-center text-xs">
          {t('about.version', {
            version: versionLabel.version,
            update: versionLabel.update ?? t('about.embedded'),
          })}
        </Text>
      </ScrollView>
    </UIScreen>
  );
};
