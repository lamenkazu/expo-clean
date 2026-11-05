import { AppTabBar } from '@infra/app/navigation/app-tab-bar';
import { MAIN_TABS } from '@infra/app/navigation/main-tabs';
import { Tabs } from 'expo-router';

// O Expo Router 58 so mostra as telas declaradas no layout. As abas saem de MAIN_TABS, a mesma
// lista que a barra usa, para uma aba nova entrar num lugar so.
const MainTabsLayout = () => (
  <Tabs tabBar={props => <AppTabBar {...props} />} screenOptions={{ headerShown: false }}>
    {MAIN_TABS.map(tab => (
      <Tabs.Screen key={tab.route} name={tab.route} />
    ))}
  </Tabs>
);

export default MainTabsLayout;
