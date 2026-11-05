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
import { useSignInViewModel } from './view-model';

export const SignInView = () => {
  const { t } = useTranslation('auth');
  const { form, error, actions } = useSignInViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const submitForm = () => handleSubmit(actions.submit)();

  return (
    <UISection title={t('signIn.title')} subtitle={t('signIn.subtitle')}>
      <View className="gap-3">
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
              onChangeText={text => {
                actions.resetError();
                onChange(text);
              }}
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
              autoComplete="current-password"
              value={value}
              returnKeyType="send"
              onSubmitEditing={submitForm}
              onChangeText={text => {
                actions.resetError();
                onChange(text);
              }}
              errorMessage={translateFieldError(t, errors.password?.message)}
            />
          )}
        />
      </View>

      <UIMessage tone="error" message={error} className="mt-3" />

      <UIButton
        loading={isSubmitting}
        loadingLabel={t('signIn.submitting')}
        label={t('signIn.submit')}
        onPress={submitForm}
        containerClassName="mt-6"
      />

      <UIButton
        variant="ghost"
        label={t('signIn.createAccount')}
        onPress={actions.goToSignUp}
        containerClassName="mt-3"
      />

      <View className="mt-5 items-center">
        <UITextLinkButton
          label={t('signIn.forgotPassword')}
          align="center"
          onPress={actions.goToForgotPassword}
        />
      </View>
    </UISection>
  );
};
