import { MAIN_TABS } from '@infra/app/navigation/main-tabs';
import { TourProvider } from '@infra/app/providers/tour-provider';
import i18n from '@infra/shared/i18n';
import { TestProviders } from '@test/utils/providers';
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import type { PropsWithChildren } from 'react';
import { Text } from 'react-native';
import MainTabsLayout from '../../../../app/(main)/_layout';

const wrapper = ({ children }: PropsWithChildren) => (
  <TestProviders>
    <TourProvider>{children}</TourProvider>
  </TestProviders>
);

// Uma tela falsa por aba de MAIN_TABS, para o teste valer com qualquer conjunto de abas.
const tabRoutes = Object.fromEntries(
  MAIN_TABS.map(tab => [`(main)/${tab.route}`, () => <Text>{`tela ${tab.route}`}</Text>])
);

// O Expo Router 58 so mostra as telas declaradas no layout. Sem a declaracao, as abas ficam vazias.
describe('layout das abas', () => {
  it('mostra a aba inicial e troca de aba pela barra', async () => {
    await renderRouter(
      { '(main)/_layout': MainTabsLayout, ...tabRoutes },
      { initialUrl: '/', wrapper }
    );

    expect(await screen.findByText('tela index')).toBeVisible();

    fireEvent.press(screen.getByRole('tab', { name: i18n.t('tabs.settings') }));

    expect(await screen.findByText('tela settings')).toBeVisible();
  });
});
