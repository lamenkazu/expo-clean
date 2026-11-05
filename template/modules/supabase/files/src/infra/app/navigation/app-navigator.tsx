import { AuthProvider, useAuth } from '@infra/app/providers/auth-provider';
import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Sem sessao, so o grupo (public) abre. A rota pedida volta depois do login pelo parametro redirect.
const AuthGuard = () => {
  const { isLoading, session } = useAuth();
  const colors = useAppColors();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inPublicGroup = segments[0] === '(public)';
    // A recuperacao de senha abre a sessao pelo link e continua na mesma tela.
    const inRecovery = pathname === '/recovery';

    if (!session && !inPublicGroup) {
      router.replace(
        pathname && pathname !== '/'
          ? { pathname: '/sign-in', params: { redirect: pathname } }
          : '/sign-in'
      );
      return;
    }

    if (session && inPublicGroup && !inRecovery) {
      router.replace('/');
    }
  }, [isLoading, pathname, router, segments, session]);

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(main)" />
      <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
    </Stack>
  );
};

export const AppNavigator = () => (
  <AuthProvider>
    <AuthGuard />
  </AuthProvider>
);
