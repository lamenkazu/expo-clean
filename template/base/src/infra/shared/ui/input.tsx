import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import { type ComponentRef, type ReactNode, type Ref, useCallback, useEffect, useRef } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

export type UIInputHandle = ComponentRef<typeof TextInput>;

export interface UIInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  ref?: Ref<UIInputHandle>;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  // texto de apoio abaixo do campo; o erro, quando existe, toma o lugar dele
  help?: string;
  errorMessage?: string;
  containerClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  rightAccessory?: ReactNode;
  onPressRightAccessory?: () => void;
  rightAccessoryAccessibilityLabel?: string;
}

// No Android, o autoFocus nativo nao abre o teclado enquanto o Modal ainda esta aparecendo.
const AUTO_FOCUS_DELAY_MS = 250;

const INPUT_PADDING_X = 16;
// espaco do botao de 48 a direita (w-12)
const INPUT_PADDING_WITH_ACCESSORY = 48;

export const UIInput = ({
  ref,
  autoFocus,
  value,
  onChangeText,
  label,
  help,
  errorMessage,
  multiline,
  placeholderTextColor,
  containerClassName,
  inputClassName,
  errorClassName,
  rightAccessory,
  onPressRightAccessory,
  rightAccessoryAccessibilityLabel,
  ...rest
}: UIInputProps) => {
  const colors = useAppColors();
  const shape = useAppShape();
  const inputRef = useRef<UIInputHandle | null>(null);

  // a ref interna serve ao autoFocus; a de fora, a quem precisa focar o campo
  const setInputRef = useCallback(
    (input: UIInputHandle | null) => {
      inputRef.current = input;

      if (typeof ref === 'function') {
        ref(input);
      } else if (ref) {
        ref.current = input;
      }
    },
    [ref]
  );

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const timeout = setTimeout(() => inputRef.current?.focus(), AUTO_FOCUS_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [autoFocus]);

  return (
    <View className={containerClassName}>
      {label ? (
        <Text style={{ color: colors.textMuted }} className="mb-1.5 text-sm font-medium">
          {label}
        </Text>
      ) : null}

      <View className="relative">
        <TextInput
          ref={setInputRef}
          value={value}
          onChangeText={onChangeText}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          placeholderTextColor={placeholderTextColor ?? colors.placeholder}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={{
            backgroundColor: colors.inputBackground,
            borderColor: errorMessage ? colors.danger : colors.inputBorder,
            borderRadius: shape.buttonRadius,
            borderWidth: shape.borderWidth,
            color: colors.text,
            // px-4/pr-12 viram padding-inline, que o TextInput do Android ignora
            paddingLeft: INPUT_PADDING_X,
            paddingRight: rightAccessory ? INPUT_PADDING_WITH_ACCESSORY : INPUT_PADDING_X,
          }}
          className={`py-3 ${multiline ? 'min-h-24' : ''} ${inputClassName ?? ''}`.trim()}
          {...rest}
        />

        {rightAccessory ? (
          <Pressable
            onPress={onPressRightAccessory}
            accessibilityRole="button"
            accessibilityLabel={rightAccessoryAccessibilityLabel}
            className="absolute bottom-0 right-0 top-0 w-12 items-center justify-center"
          >
            {rightAccessory}
          </Pressable>
        ) : null}
      </View>

      {errorMessage ? (
        <Text
          style={{ color: colors.danger }}
          className={`mt-1 text-sm ${errorClassName ?? ''}`.trim()}
        >
          {errorMessage}
        </Text>
      ) : help ? (
        <Text style={{ color: colors.textMuted }} className="mt-1 text-sm">
          {help}
        </Text>
      ) : null}
    </View>
  );
};
