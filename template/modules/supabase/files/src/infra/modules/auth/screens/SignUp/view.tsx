import { PasswordInput } from '@infra/modules/auth/components/password-input';
import { translateFieldError } from '@infra/modules/auth/validation';
import { UIButton } from '@infra/shared/ui/button';
import { UIInput } from '@infra/shared/ui/input';
import { UIMessage } from '@infra/shared/ui/message';
import { UISection } from '@infra/shared/ui/section';
import { UITextLinkButton } from '@infra/shared/ui/text-link-button';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSignUpViewModel } from './view-model';

export const SignUpView = () => {
  const { t } = useTranslation('auth');
  const { form, error, actions } = useSignUpViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const submitForm = () => handleSubmit(actions.submit)();

  const onChangeWithReset = (onChange: (text: string) => void) => (text: string) => {
    actions.resetError();
    onChange(text);
  };

  return (
    <UISection title={t('signUp.title')}>
      <View className="gap-3">
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <UIInput
              label={t('fields.fullName')}
              autoComplete="name"
              value={value}
              returnKeyType="next"
              onChangeText={onChangeWithReset(onChange)}
              errorMessage={translateFieldError(t, errors.fullName?.message)}
            />
          )}
        />

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
              returnKeyType="next"
              onChangeText={onChangeWithReset(onChange)}
              errorMessage={translateFieldError(t, errors.email?.message)}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              label={t('fields.password')}
              autoComplete="new-password"
              value={value}
              returnKeyType="next"
              onChangeText={onChangeWithReset(onChange)}
              errorMessage={translateFieldError(t, errors.password?.message)}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              label={t('fields.confirmPassword')}
              autoComplete="new-password"
              value={value}
              returnKeyType="send"
              onSubmitEditing={submitForm}
              onChangeText={onChangeWithReset(onChange)}
              errorMessage={translateFieldError(t, errors.confirmPassword?.message)}
            />
          )}
        />
      </View>

      <UIMessage tone="error" message={error} className="mt-3" />

      <UIButton
        loading={isSubmitting}
        loadingLabel={t('signUp.submitting')}
        label={t('signUp.submit')}
        onPress={submitForm}
        containerClassName="mt-6"
      />

      <View className="mt-5">
        <UITextLinkButton
          label={t('signUp.haveAccount')}
          align="center"
          onPress={actions.goToSignIn}
        />
      </View>
    </UISection>
  );
};
