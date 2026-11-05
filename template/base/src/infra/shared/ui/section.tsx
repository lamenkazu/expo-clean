import { UICard } from '@infra/shared/ui/card';
import { UIScreen } from '@infra/shared/ui/screen';
import { type ReactNode, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export interface UISectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  containerClassName?: string;
  cardClassName?: string;
  contentClassName?: string;
}

// Tela de formulario curto (login, cadastro): um cartao centralizado que acompanha o teclado.
export const UISection = ({
  title,
  subtitle,
  children,
  containerClassName,
  cardClassName,
  contentClassName,
}: UISectionProps) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  const isKeyboardOpen = keyboardHeight > 0;
  const androidKeyboardOffset = Platform.OS === 'android' ? keyboardHeight : 0;

  return (
    <UIScreen padded={false} className={`px-6 ${containerClassName ?? ''}`.trim()}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingTop: isKeyboardOpen ? 16 : 12,
            paddingBottom: isKeyboardOpen ? androidKeyboardOffset - 20 : 12,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full">
            <UICard
              title={title}
              subtitle={subtitle}
              className={`w-full p-6 ${cardClassName ?? ''}`.trim()}
              titleClassName="text-3xl"
              contentClassName={`mt-6 ${contentClassName ?? ''}`.trim()}
            >
              {children}
            </UICard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </UIScreen>
  );
};
