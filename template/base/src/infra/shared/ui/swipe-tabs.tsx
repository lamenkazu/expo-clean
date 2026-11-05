import type { TourTargetId } from '@core/domain/tours';
import { UITourTarget } from '@infra/app/providers/tour-provider';
import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import {
  Children,
  type ComponentRef,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  I18nManager,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export interface UISwipeTab<Key extends string> {
  key: Key;
  label: string;
}

export interface UISwipeTabsProps<Key extends string> {
  tabs: UISwipeTab<Key>[];
  activeKey: Key;
  onChange: (key: Key) => void;
  children: ReactNode;
  tourTarget?: TourTargetId;
}

// Abas que tambem mudam ao deslizar. Cada pagina cuida da propria rolagem vertical.
// Nao coloque rolagem horizontal dentro de uma pagina: os dois gestos entram em conflito.
export const UISwipeTabs = <Key extends string>({
  tabs,
  activeKey,
  onChange,
  children,
  tourTarget,
}: UISwipeTabsProps<Key>) => {
  const colors = useAppColors();
  const shape = useAppShape();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;
  const visibleIndexRef = useRef(0);
  const targetIndexRef = useRef<number | null>(null);
  // No layout invertido, a rolagem conta da esquerda fisica, e a primeira aba fica a direita.
  const lastIndex = tabs.length - 1;
  const toScrollPage = useCallback(
    (index: number) => (I18nManager.isRTL ? lastIndex - index : index),
    [lastIndex]
  );
  const activeIndex = Math.max(
    0,
    tabs.findIndex(tab => tab.key === activeKey)
  );

  useEffect(() => {
    if (width === 0 || activeIndex === visibleIndexRef.current) {
      return;
    }

    targetIndexRef.current = activeIndex;
    scrollRef.current?.scrollTo({ x: toScrollPage(activeIndex) * width, animated: true });
  }, [activeIndex, toScrollPage, width]);

  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width === 0) {
      return;
    }

    const index = toScrollPage(Math.round(nativeEvent.contentOffset.x / width));

    // Durante uma troca pelo toque, a pagina passa pelas do meio sem alterar a aba escolhida.
    if (targetIndexRef.current !== null) {
      if (index === targetIndexRef.current) {
        visibleIndexRef.current = index;
        targetIndexRef.current = null;
      }

      return;
    }

    if (index !== visibleIndexRef.current && tabs[index]) {
      visibleIndexRef.current = index;
      onChange(tabs[index].key);
    }
  };

  return (
    <View className="flex-1">
      <View className="px-4 pb-2.5">
        <UITourTarget
          id={tourTarget}
          accessibilityRole="tablist"
          className="flex-row gap-0.5 p-[3px]"
          style={{ backgroundColor: colors.segmentBackground, borderRadius: shape.buttonRadius }}
        >
          {tabs.map(tab => {
            const isActive = tab.key === activeKey;

            return (
              <Pressable
                key={tab.key}
                onPress={() => onChange(tab.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                className="min-h-10 flex-1 items-center justify-center px-1.5"
                style={{
                  backgroundColor: isActive
                    ? colors.segmentActiveBackground
                    : colors.segmentBackground,
                  borderRadius: Math.max(shape.buttonRadius - 3, 0),
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: isActive ? colors.segmentActiveForeground : colors.segmentForeground,
                  }}
                  className="text-[13px] font-semibold"
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </UITourTarget>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onLayout={event =>
          setSize({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        {Children.toArray(children).map(child => (
          <View key={(child as { key?: string }).key} style={{ width, height }}>
            {child}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
