import { Stack } from 'expo-router';

// Pilha principal. Rotas novas aparecem sozinhas; registre aqui so as que mudam opcoes.
export const AppNavigator = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(main)" />
    <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
  </Stack>
);
