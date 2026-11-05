import { ToastOutlet } from '@infra/app/providers/toast-provider';
import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import { type ReactNode, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
} from 'react-native';

export interface UIModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const UIModal = ({ visible, title, onClose, children }: UIModalProps) => {
  const colors = useAppColors();
  const shape = useAppShape();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const isKeyboardOpen = keyboardHeight > 0;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, event => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 px-5"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}
      >
        <KeyboardAvoidingView
          className="flex-1 items-center"
          style={{ justifyContent: isKeyboardOpen ? 'flex-end' : 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            onPress={event => event.stopPropagation()}
            accessibilityViewIsModal
            className="max-h-[85%] w-full border p-5"
            style={{
              backgroundColor: colors.sheetBackground,
              borderColor: colors.divider,
              borderRadius: shape.sheetRadius,
              marginBottom:
                Platform.OS === 'android' && isKeyboardOpen ? Math.max(12, keyboardHeight + 12) : 0,
            }}
          >
            <Text
              accessibilityRole="header"
              style={{ color: colors.text }}
              className="text-lg font-semibold"
            >
              {title}
            </Text>

            <ScrollView
              className="mt-4"
              bounces={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>

      <ToastOutlet />
    </Modal>
  );
};
