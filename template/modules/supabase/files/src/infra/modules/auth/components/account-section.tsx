import { useAuth } from '@infra/app/providers/auth-provider';
import { useToast } from '@infra/app/providers/toast-provider';
import { useAppColors, useAppSurfaces } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UIConfirmDialog } from '@infra/shared/ui/confirm-dialog';
import { UISectionTitle } from '@infra/shared/ui/typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

// Secao de conta nos Ajustes: mostra o e-mail e permite sair.
export const AccountSection = () => {
  const { t } = useTranslation('auth');
  const colors = useAppColors();
  const surfaces = useAppSurfaces();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const confirmSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await signOut();
    setIsSigningOut(false);
    setIsDialogOpen(false);

    // Sem erro, o guard de autenticacao leva a pessoa para a tela de entrar.
    if (error) {
      showToast(error, 'error');
    }
  };

  return (
    <View className="gap-2">
      <UISectionTitle>{t('account.title')}</UISectionTitle>
      <View className="gap-3 p-4" style={surfaces.card}>
        <Text style={{ color: colors.textMuted }} className="text-sm">
          {t('account.signedInAs', { email: user?.email ?? '-' })}
        </Text>
        <UIButton
          label={t('account.signOut')}
          variant="dangerSoft"
          onPress={() => setIsDialogOpen(true)}
        />
      </View>

      <UIConfirmDialog
        visible={isDialogOpen}
        title={t('account.signOut')}
        message={t('account.signOutMessage')}
        confirmLabel={t('account.signOut')}
        isConfirmLoading={isSigningOut}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={confirmSignOut}
      />
    </View>
  );
};
