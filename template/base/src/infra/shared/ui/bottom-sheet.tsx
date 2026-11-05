import { ToastOutlet } from '@infra/app/providers/toast-provider';
import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface UIBottomSheetProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  position?: 'bottom' | 'top';
}

export const UIBottomSheet = ({
  visible,
  title,
  subtitle,
  onClose,
  children,
  position = 'bottom',
}: UIBottomSheetProps) => {
  const { t } = useTranslation();
  const colors = useAppColors();
  const shape = useAppShape();
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const isTop = position === 'top';

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, event => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View className={isTop ? 'flex-1 justify-start' : 'flex-1 justify-end'}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('actions.close')}
          className="absolute bottom-0 left-0 right-0 top-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.42)' }}
        />

        <View
          className="max-h-[88%] px-4"
          style={{
            backgroundColor: colors.sheetBackground,
            borderTopLeftRadius: isTop ? 0 : shape.sheetRadius,
            borderTopRightRadius: isTop ? 0 : shape.sheetRadius,
            borderBottomLeftRadius: isTop ? shape.sheetRadius : 0,
            borderBottomRightRadius: isTop ? shape.sheetRadius : 0,
            paddingTop: isTop ? insets.top + 12 : 10,
            paddingBottom: isTop ? 18 : Math.max(insets.bottom, 12) + 12,
            marginBottom: isTop ? 0 : keyboardHeight,
          }}
        >
          {isTop ? null : (
            <View
              className="mb-3 h-1 w-10 self-center rounded-full"
              style={{ backgroundColor: colors.border }}
            />
          )}

          {title ? (
            <Text
              accessibilityRole="header"
              style={{ color: colors.text }}
              className="mb-1 text-lg font-bold"
            >
              {title}
            </Text>
          ) : null}

          {subtitle ? (
            <Text style={{ color: colors.textMuted }} className="mb-1 text-sm">
              {subtitle}
            </Text>
          ) : null}

          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-3 pt-2"
          >
            {children}
          </ScrollView>
        </View>

        <ToastOutlet />
      </View>
    </Modal>
  );
};
