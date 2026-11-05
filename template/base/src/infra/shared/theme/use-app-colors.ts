import { useAppTheme } from '@infra/app/providers/theme-provider';
import { AppThemes } from '@infra/shared/theme/theme';
import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

export const useAppColors = () => {
  const { mode, themeName } = useAppTheme();
  return AppThemes[themeName][mode].colors;
};

export const useAppShape = () => {
  const { mode, themeName } = useAppTheme();
  return AppThemes[themeName][mode].shape;
};

// Estilos que mudam de estrutura entre os temas, e nao so de cor.
export const useAppSurfaces = () => {
  const colors = useAppColors();
  const shape = useAppShape();

  return useMemo(() => {
    const divider: ViewStyle = { borderColor: colors.divider, borderStyle: shape.borderStyle };
    const flatEdges: ViewStyle = {
      ...divider,
      backgroundColor: 'transparent',
      borderRadius: 0,
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: shape.borderWidth,
    };
    const raised: ViewStyle = shape.hasCardShadow
      ? { boxShadow: '0px 4px 12px rgba(10, 50, 25, 0.1)' }
      : {};

    return {
      divider,
      card: shape.isFlat
        ? { ...flatEdges, paddingHorizontal: 0 }
        : ({
            ...raised,
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
            borderRadius: shape.cardRadius,
            borderWidth: 0,
          } satisfies ViewStyle),
      // Linha de uma lista agrupada: so a primeira e a ultima arredondam.
      groupRow: (isFirst: boolean, isLast: boolean): ViewStyle =>
        shape.isFlat
          ? flatEdges
          : {
              backgroundColor: colors.cardBackground,
              borderColor: colors.divider,
              borderTopWidth: isFirst ? 0 : 1,
              borderTopLeftRadius: isFirst ? shape.cardRadius : 0,
              borderTopRightRadius: isFirst ? shape.cardRadius : 0,
              borderBottomLeftRadius: isLast ? shape.cardRadius : 0,
              borderBottomRightRadius: isLast ? shape.cardRadius : 0,
            },
      pill: {
        backgroundColor: colors.pillBackground,
        borderColor: colors.pillBorder,
        borderRadius: shape.chipRadius,
        borderStyle: shape.dashedControls ? 'dashed' : 'solid',
        borderWidth: shape.borderWidth,
      } satisfies ViewStyle,
      bar: {
        backgroundColor: colors.tabBackground,
        borderColor: colors.tabBorder,
        borderTopWidth: colors.tabBorder === 'transparent' ? 0 : 1,
      } satisfies ViewStyle,
    };
  }, [colors, shape]);
};
