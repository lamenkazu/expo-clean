import { PasswordInput } from '@infra/modules/auth/components/password-input';
import { translateFieldError } from '@infra/modules/auth/validation';
import { UIButton } from '@infra/shared/ui/button';
import { UIMessage } from '@infra/shared/ui/message';
import { UISection } from '@infra/shared/ui/section';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useRecoveryPasswordViewModel } from './view-model';

export const RecoveryPasswordView = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { form, state, canSubmit, actions } = useRecoveryPasswordViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const submitForm = () => handleSubmit(actions.submit)();

  return (
    <UISection title={t('recovery.title')} subtitle={t('recovery.subtitle')}>
      <UIMessage
        tone="info"
        message={state.isPreparing ? t('recovery.validating') : null}
        className="mb-3"
      />
      <UIMessage tone="error" message={state.callbackError} className="mb-3" />

      <View className="gap-3">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              label={t('fields.newPassword')}
              autoComplete="new-password"
              value={value}
              returnKeyType="next"
              onChangeText={text => {
                actions.resetMessages();
                onChange(text);
              }}
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
              onChangeText={text => {
                actions.resetMessages();
                onChange(text);
              }}
              errorMessage={translateFieldError(t, errors.confirmPassword?.message)}
            />
          )}
        />
      </View>

      <UIMessage tone="error" message={state.error} className="mt-3" />
      <UIMessage tone="success" message={state.success} className="mt-3" />

      <UIButton
        disabled={!canSubmit}
        loading={isSubmitting}
        loadingLabel={t('common:actions.saving')}
        label={t('recovery.submit')}
        onPress={submitForm}
        containerClassName="mt-6"
      />

      {state.success ? (
        <UIButton
          variant="ghost"
          label={t('recovery.goToSignIn')}
          onPress={actions.goToSignIn}
          containerClassName="mt-3"
        />
      ) : null}
    </UISection>
  );
};
