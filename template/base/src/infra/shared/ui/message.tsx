import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { Text } from 'react-native';

export type UIMessageTone = 'error' | 'success' | 'info';

export interface UIMessageProps {
  tone: UIMessageTone;
  message?: string | null;
  className?: string;
}

export const UIMessage = ({ tone, message, className }: UIMessageProps) => {
  const colors = useAppColors();

  if (!message) {
    return null;
  }

  const toneStyleMap = {
    error: { color: colors.danger },
    success: { color: colors.success },
    info: { color: colors.textMuted },
  } as const;

  return (
    <Text
      accessibilityLiveRegion={tone === 'error' ? 'assertive' : 'polite'}
      style={toneStyleMap[tone]}
      className={`text-sm ${className ?? ''}`.trim()}
    >
      {message}
    </Text>
  );
};
