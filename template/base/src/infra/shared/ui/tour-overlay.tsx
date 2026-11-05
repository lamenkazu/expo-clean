import { useAppColors, useAppShape } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Modal, Pressable, Text, View, type ViewStyle } from 'react-native';

export interface UITourRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UITourOverlayProps {
  visible: boolean;
  title: string;
  body: string;
  // Sem area, o texto aparece no centro da tela.
  rect: UITourRect | null;
  index: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}

const DIM = 'rgba(0, 0, 0, 0.66)';
const SPOT_PADDING = 6;
const CARD_GAP = 14;
const CARD_MARGIN = 16;
const CARD_RESERVED_HEIGHT = 230;

// O layout invertido troca left e right, mas a medida da tela vem sempre da esquerda fisica.
const fromPhysicalLeft = (distance: number): ViewStyle =>
  I18nManager.isRTL ? { right: distance } : { left: distance };

const fromPhysicalRight = (distance: number): ViewStyle =>
  I18nManager.isRTL ? { left: distance } : { right: distance };

export const UITourOverlay = ({
  visible,
  title,
  body,
  rect,
  index,
  total,
  onBack,
  onNext,
  onClose,
}: UITourOverlayProps) => {
  const { t } = useTranslation();
  const colors = useAppColors();
  const shape = useAppShape();
  const [screen, setScreen] = useState({ width: 0, height: 0 });
  const isLast = index === total - 1;

  const spot = rect
    ? {
        x: Math.max(0, rect.x - SPOT_PADDING),
        y: Math.max(0, rect.y - SPOT_PADDING),
        width: rect.width + SPOT_PADDING * 2,
        height: rect.height + SPOT_PADDING * 2,
      }
    : null;

  const spotBottom = spot ? spot.y + spot.height : 0;
  const placeBelow = spot ? spot.y + spot.height / 2 < screen.height / 2 : false;
  const cardPosition: ViewStyle = !spot
    ? { top: 0, bottom: 0, justifyContent: 'center' }
    : placeBelow
      ? { top: Math.min(spotBottom + CARD_GAP, screen.height - CARD_RESERVED_HEIGHT) }
      : { bottom: Math.max(screen.height - spot.y + CARD_GAP, 24) };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View
        className="flex-1"
        onLayout={event =>
          setScreen({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }
      >
        {spot ? (
          <>
            <View
              className="absolute left-0 right-0 top-0"
              style={{ height: spot.y, backgroundColor: DIM }}
            />
            <View
              className="absolute bottom-0 left-0 right-0"
              style={{ top: spotBottom, backgroundColor: DIM }}
            />
            <View
              className="absolute"
              style={[
                fromPhysicalLeft(0),
                { top: spot.y, height: spot.height, width: spot.x, backgroundColor: DIM },
              ]}
            />
            <View
              className="absolute"
              style={[
                fromPhysicalRight(0),
                {
                  top: spot.y,
                  height: spot.height,
                  width: Math.max(0, screen.width - spot.x - spot.width),
                  backgroundColor: DIM,
                },
              ]}
            />
            <View
              pointerEvents="none"
              className="absolute"
              style={[
                fromPhysicalLeft(spot.x),
                {
                  top: spot.y,
                  width: spot.width,
                  height: spot.height,
                  borderColor: colors.accent,
                  borderRadius: Math.min(shape.cardRadius + 4, 14),
                  borderWidth: 2,
                },
              ]}
            />
          </>
        ) : (
          <View
            className="absolute bottom-0 left-0 right-0 top-0"
            style={{ backgroundColor: DIM }}
          />
        )}

        {/* Bloqueia toques na tela por tras: o tour so avanca pelos botoes. */}
        <Pressable accessible={false} className="absolute bottom-0 left-0 right-0 top-0" />

        <View
          pointerEvents="box-none"
          className="absolute"
          style={[{ left: CARD_MARGIN, right: CARD_MARGIN }, cardPosition]}
        >
          <View
            accessibilityViewIsModal
            accessibilityLiveRegion="polite"
            className="gap-2 p-4"
            style={{
              backgroundColor: colors.sheetBackground,
              borderColor: colors.divider,
              borderRadius: shape.sheetRadius,
              borderWidth: shape.borderWidth,
            }}
          >
            <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">
              {t('tour.progress', { current: index + 1, total })}
            </Text>
            <Text
              accessibilityRole="header"
              style={{ color: colors.text }}
              className="text-lg font-bold"
            >
              {title}
            </Text>
            <Text style={{ color: colors.text }} className="text-[15px] leading-[22px]">
              {body}
            </Text>

            <View className="mt-2 flex-row items-center gap-2">
              {isLast ? (
                <View className="flex-1" />
              ) : (
                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  className="min-h-11 flex-1 justify-center"
                >
                  <Text style={{ color: colors.textMuted }} className="font-semibold">
                    {t('actions.skip')}
                  </Text>
                </Pressable>
              )}
              {index > 0 ? (
                <UIButton
                  label={t('actions.back')}
                  size="sm"
                  variant="secondary"
                  onPress={onBack}
                />
              ) : null}
              <UIButton
                label={isLast ? t('actions.finish') : t('actions.next')}
                size="sm"
                onPress={onNext}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
