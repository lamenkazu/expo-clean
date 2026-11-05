import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIIcon } from '@infra/shared/ui/icon';
import { UIInput, type UIInputProps } from '@infra/shared/ui/input';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type PasswordInputProps = Omit<
  UIInputProps,
  'secureTextEntry' | 'rightAccessory' | 'onPressRightAccessory'
>;

// Campo de senha com o botao de mostrar e ocultar.
export const PasswordInput = (props: PasswordInputProps) => {
  const { t } = useTranslation('auth');
  const colors = useAppColors();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <UIInput
      {...props}
      autoCapitalize="none"
      autoCorrect={false}
      secureTextEntry={!isVisible}
      rightAccessory={
        <UIIcon name={isVisible ? 'eyeOff' : 'eye'} size={18} color={colors.textMuted} />
      }
      onPressRightAccessory={() => setIsVisible(prev => !prev)}
      rightAccessoryAccessibilityLabel={isVisible ? t('password.hide') : t('password.show')}
    />
  );
};
