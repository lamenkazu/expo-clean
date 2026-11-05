import { translateFieldError } from '@infra/modules/auth/validation';
import { UIButton } from '@infra/shared/ui/button';
import { UIInput } from '@infra/shared/ui/input';
import { UIMessage } from '@infra/shared/ui/message';
import { UISection } from '@infra/shared/ui/section';
import { UITextLinkButton } from '@infra/shared/ui/text-link-button';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useForgotPasswordViewModel } from './view-model';

export const ForgotPasswordView = () => {
  const { t } = useTranslation('auth');
  const { form, state, actions } = useForgotPasswordViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const submitForm = () => handleSubmit(actions.submit)();

  return (
    <UISection title={t('forgot.title')} subtitle={t('forgot.subtitle')}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <UIInput
            label={t('fields.email')}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder={t('fields.emailPlaceholder')}
            value={value}
            returnKeyType="send"
            onSubmitEditing={submitForm}
            onChangeText={text => {
              actions.resetMessages();
              onChange(text);
            }}
            errorMessage={translateFieldError(t, errors.email?.message)}
          />
        )}
      />

      <UIMessage tone="error" message={state.error} className="mt-3" />
      <UIMessage tone="success" message={state.success} className="mt-3" />

      <UIButton
        loading={isSubmitting}
        loadingLabel={t('forgot.submitting')}
        label={t('forgot.submit')}
        onPress={submitForm}
        containerClassName="mt-6"
      />

      <View className="mt-5">
        <UITextLinkButton label={t('forgot.back')} align="center" onPress={actions.goToSignIn} />
      </View>
    </UISection>
  );
};
