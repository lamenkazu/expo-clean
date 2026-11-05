import { UITourTarget } from '@infra/app/providers/tour-provider';
import { useAppColors, useAppShape, useAppSurfaces } from '@infra/shared/theme/use-app-colors';
import { UIIcon } from '@infra/shared/ui/icon';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { MAIN_TABS } from './main-tabs';

export const AppTabBar = ({ state, navigateToTab, insets }: BottomTabBarProps) => {
  const { t } = useTranslation();
  const colors = useAppColors();
  const shape = useAppShape();
  const surfaces = useAppSurfaces();
  const activeRoute = state.routes[state.index]?.name;
  const routeKeys = new Map(state.routes.map(route => [route.name, route.key]));

  return (
    <View
      accessibilityRole="tablist"
      className="flex-row items-end px-1.5 pt-1.5"
      style={[surfaces.bar, { paddingBottom: Math.max(insets.bottom, 8) + 4 }]}
    >
      {MAIN_TABS.map(tab => {
        const isActive = activeRoute === tab.route;
        const label = t(tab.labelKey as never);

        return (
          <UITourTarget key={tab.route} id={tab.target} className="min-w-0 flex-1">
            <Pressable
              onPress={() => {
                const key = routeKeys.get(tab.route);

                if (key) {
                  navigateToTab(key);
                }
              }}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: isActive }}
              className="min-h-[52px] items-center justify-center gap-0.5 px-0.5"
            >
              <View
                className="h-7 w-[52px] items-center justify-center"
                style={{
                  backgroundColor: isActive ? colors.tabActiveBackground : colors.tabBackground,
                  borderRadius: shape.tabRadius,
                }}
              >
                <UIIcon
                  name={tab.icon}
                  size={20}
                  color={isActive ? colors.tabActiveForeground : colors.tabForeground}
                />
              </View>
              <Text
                numberOfLines={1}
                style={{ color: colors.tabForeground }}
                className={isActive ? 'text-[11px] font-bold' : 'text-[11px]'}
              >
                {label}
              </Text>
            </Pressable>
          </UITourTarget>
        );
      })}
    </View>
  );
};
