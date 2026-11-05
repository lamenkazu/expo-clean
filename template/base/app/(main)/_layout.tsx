import { AppTabBar } from '@infra/app/navigation/app-tab-bar';
import { Tabs } from 'expo-router';

const MainTabsLayout = () => (
  <Tabs tabBar={props => <AppTabBar {...props} />} screenOptions={{ headerShown: false }} />
);

export default MainTabsLayout;
