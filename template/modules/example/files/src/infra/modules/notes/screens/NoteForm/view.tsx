import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UIConfirmDialog } from '@infra/shared/ui/confirm-dialog';
import { UIHeader } from '@infra/shared/ui/header';
import { UIInput } from '@infra/shared/ui/input';
import { UIMessage } from '@infra/shared/ui/message';
import { UIScreen } from '@infra/shared/ui/screen';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { LIMITS } from './model';
import { useNoteFormViewModel } from './view-model';

export const NoteFormView = () => {
  const { t } = useTranslation(['notes', 'common']);
  const colors = useAppColors();
  const { form, isNew, canDelete, isLoading, isDeleting, error, actions } = useNoteFormViewModel();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { control, handleSubmit, formState } = form;

  return (
    <UIScreen padded={false}>
      <KeyboardAvoidingView className="flex-1">
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-4 p-4">
          <UIHeader
            title={isNew ? t('form.newTitle') : t('form.editTitle')}
            onBack={actions.back}
            className="mb-0"
          />

          <UIMessage tone="error" message={error} />

          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View className="gap-4">
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <UIInput
                    label={t('form.title')}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    autoFocus={isNew}
                    maxLength={LIMITS.title}
                    errorMessage={
                      fieldState.error?.message
                        ? t(fieldState.error.message as never, { max: LIMITS.title })
                        : undefined
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="body"
                render={({ field, fieldState }) => (
                  <UIInput
                    label={t('form.body')}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    multiline
                    textAlignVertical="top"
                    inputClassName="min-h-40"
                    errorMessage={
                      fieldState.error?.message
                        ? t(fieldState.error.message as never, { max: LIMITS.body })
                        : undefined
                    }
                  />
                )}
              />

              <UIButton
                label={t('common:actions.save')}
                loading={formState.isSubmitting}
                loadingLabel={t('common:actions.saving')}
                disabled={!formState.isValid}
                onPress={() => handleSubmit(actions.submit)()}
              />

              {canDelete ? (
                <UIButton
                  label={t('common:actions.delete')}
                  variant="dangerSoft"
                  onPress={() => setIsDeleteDialogOpen(true)}
                />
              ) : null}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <UIConfirmDialog
        visible={isDeleteDialogOpen}
        title={t('form.deleteTitle')}
        message={t('form.deleteMessage')}
        confirmLabel={t('common:actions.delete')}
        isConfirmLoading={isDeleting}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={actions.remove}
      />
    </UIScreen>
  );
};
