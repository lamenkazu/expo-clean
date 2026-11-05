import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import { type ComponentRef, type ReactNode, useEffect, useRef } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

export interface UIInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
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

export const UIInput = ({
  autoFocus,
  value,
  onChangeText,
  label,
  errorMessage,
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
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

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
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          placeholderTextColor={placeholderTextColor ?? colors.placeholder}
          style={{
            backgroundColor: colors.inputBackground,
            borderColor: errorMessage ? colors.danger : colors.inputBorder,
            borderRadius: shape.buttonRadius,
            borderWidth: shape.borderWidth,
            color: colors.text,
          }}
          className={`px-4 py-3 ${rightAccessory ? 'pr-12' : ''} ${inputClassName ?? ''}`.trim()}
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
      ) : null}
    </View>
  );
};
