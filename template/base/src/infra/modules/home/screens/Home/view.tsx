import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIPill } from '@infra/shared/ui/pill';
import { UIScreen } from '@infra/shared/ui/screen';
import { UIPageTitle } from '@infra/shared/ui/typography';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useHomeViewModel } from './view-model';

export const HomeView = () => {
  const { t } = useTranslation('home');
  const colors = useAppColors();
  const { isPro, hasDemoAccess, actions } = useHomeViewModel();

  return (
    <UIScreen padded={false} bottomInset={false}>
      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="flex-row items-center justify-between">
          <UIPageTitle>{t('title')}</UIPageTitle>
          {isPro ? <UIPill label={t('proBadge')} tone="success" /> : null}
        </View>

        <UICard title={t('welcome')} subtitle={t('subtitle')}>
          <Text style={{ color: colors.textMuted }} className="text-sm">
            {hasDemoAccess ? t('demo.unlocked') : t('demo.locked')}
          </Text>
          <UIButton
            label={t('demo.action')}
            variant={hasDemoAccess ? 'secondary' : 'primary'}
            onPress={actions.openDemoFeature}
            containerClassName="mt-3"
          />
        </UICard>
      </ScrollView>
    </UIScreen>
  );
};
