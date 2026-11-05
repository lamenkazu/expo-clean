import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIHeader } from '@infra/shared/ui/header';
import { UIIcon } from '@infra/shared/ui/icon';
import { UIScreen } from '@infra/shared/ui/screen';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { usePaywallViewModel } from './view-model';

const BENEFITS = ['noAds', 'allFeatures', 'supportDev'] as const;

export const PaywallView = () => {
  const { t } = useTranslation('paywall');
  const colors = useAppColors();
  const { isPro, product, showRewarded, busy, actions } = usePaywallViewModel();

  return (
    <UIScreen padded={false}>
      <ScrollView contentContainerClassName="gap-4 p-4">
        <UIHeader title={t('title')} subtitle={t('subtitle')} onBack={actions.close} />

        <UICard>
          <View className="gap-3">
            {BENEFITS.map(benefit => (
              <View key={benefit} className="flex-row items-center gap-2">
                <UIIcon name="check" size={18} color={colors.success} />
                <Text style={{ color: colors.text }} className="text-[15px]">
                  {t(`benefits.${benefit}`)}
                </Text>
              </View>
            ))}
          </View>

          {isPro ? (
            <Text style={{ color: colors.success }} className="mt-4 font-semibold">
              {t('alreadyPro')}
            </Text>
          ) : (
            <UIButton
              label={product ? t('buy', { price: product.priceLabel }) : t('buyUnavailable')}
              disabled={!product}
              loading={busy === 'purchase'}
              onPress={actions.buy}
              containerClassName="mt-4"
            />
          )}
        </UICard>

        {showRewarded ? (
          <UICard title={t('rewarded.title')} subtitle={t('rewarded.body')}>
            <UIButton
              label={t('rewarded.action')}
              variant="secondary"
              loading={busy === 'rewarded'}
              disabled={busy !== null}
              onPress={actions.watchRewarded}
            />
          </UICard>
        ) : null}
      </ScrollView>
    </UIScreen>
  );
};
