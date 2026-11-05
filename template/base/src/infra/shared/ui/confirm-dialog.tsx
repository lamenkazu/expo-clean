import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { UIButtonVariant } from '@infra/shared/ui/button';
import { UIButton } from '@infra/shared/ui/button';
import { UIModal } from '@infra/shared/ui/modal';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export interface UIConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: UIButtonVariant;
  isConfirmLoading?: boolean;
  confirmLoadingLabel?: string;
  children?: ReactNode;
}

// Substitui o Alert.alert, que nao segue o tema do app.
export const UIConfirmDialog = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  confirmVariant = 'danger',
  isConfirmLoading = false,
  confirmLoadingLabel,
  children,
}: UIConfirmDialogProps) => {
  const { t } = useTranslation();
  const colors = useAppColors();

  return (
    <UIModal visible={visible} title={title} onClose={onCancel}>
      <Text style={{ color: colors.textMuted }} className="text-sm leading-5">
        {message}
      </Text>

      {children ? <View className="mt-3">{children}</View> : null}

      <View className="mt-5 flex-row gap-2">
        <UIButton
          label={cancelLabel ?? t('actions.cancel')}
          variant="secondary"
          onPress={onCancel}
          disabled={isConfirmLoading}
          containerClassName="flex-1"
        />
        <UIButton
          label={confirmLabel ?? t('actions.confirm')}
          loading={isConfirmLoading}
          loadingLabel={confirmLoadingLabel}
          variant={confirmVariant}
          onPress={onConfirm}
          disabled={isConfirmLoading}
          containerClassName="flex-1"
        />
      </View>
    </UIModal>
  );
};
