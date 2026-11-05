import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIIconButton } from '@infra/shared/ui/icon-button';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

export type UIToastTone = 'success' | 'error' | 'info';

export interface UIToastProps {
  title?: string;
  message: string;
  tone?: UIToastTone;
  onClose?: () => void;
  onPress?: () => void;
}

export const UIToast = ({ title, message, tone = 'info', onClose, onPress }: UIToastProps) => {
  const { t } = useTranslation();
  const colors = useAppColors();

  const toneStyle = {
    success: { backgroundColor: colors.successSoft, borderColor: colors.success },
    error: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
    info: { backgroundColor: colors.infoSoft, borderColor: colors.info },
  }[tone];

  return (
    <View
      accessibilityLiveRegion="polite"
      style={toneStyle}
      className="mx-4 flex-row items-center gap-2 rounded-xl border px-3 py-3"
    >
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : 'text'}
        className="min-w-0 flex-1"
      >
        {title ? (
          <Text style={{ color: colors.text }} className="text-sm font-bold">
            {title}
          </Text>
        ) : null}
        {message ? (
          <Text style={{ color: colors.text }} className="text-sm font-medium">
            {message}
          </Text>
        ) : null}
      </Pressable>

      {onClose ? (
        <UIIconButton icon="x" size="sm" onPress={onClose} accessibilityLabel={t('toast.close')} />
      ) : null}
    </View>
  );
};
