import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIMessage } from '@infra/shared/ui/message';
import { UIScreen } from '@infra/shared/ui/screen';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { type PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { db } from './client';
import migrations from './migrations/migrations';

const crashReporter = DependencyInjectionFactory.getInstance().getCrashReporter();

// Roda as migrations pendentes antes de qualquer tela que leia o banco.
export const DatabaseGate = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const colors = useAppColors();
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (error) {
      crashReporter.recordError(error, 'database-migrations');
    }
  }, [error]);

  if (error) {
    return (
      <UIScreen centered>
        <UIMessage tone="error" message={t('database.failed')} className="text-center" />
      </UIScreen>
    );
  }

  if (!success) {
    return (
      <UIScreen centered>
        <ActivityIndicator size="large" color={colors.primary} />
      </UIScreen>
    );
  }

  return children;
};
