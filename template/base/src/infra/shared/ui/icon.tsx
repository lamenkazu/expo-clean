import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { I18nManager } from 'react-native';

type FeatherName = ComponentProps<typeof Feather>['name'];
type CommunityName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Os icones do app ganham um nome proprio aqui. Assim a troca de biblioteca fica em um arquivo so.
const FEATHER_ICONS = {
  home: 'home',
  settings: 'settings',
  list: 'list',
  plus: 'plus',
  left: 'chevron-left',
  right: 'chevron-right',
  down: 'chevron-down',
  more: 'more-vertical',
  check: 'check',
  edit: 'edit-2',
  trash: 'trash-2',
  alert: 'alert-circle',
  x: 'x',
  star: 'star',
  lock: 'lock',
  unlock: 'unlock',
  share: 'share-2',
  copy: 'copy',
  search: 'search',
  info: 'info',
  // @inject:icons-feather
} as const satisfies Record<string, FeatherName>;

// O Feather nao tem estes desenhos.
const COMMUNITY_ICONS = {
  crown: 'crown-outline',
  ad: 'television-play',
  // @inject:icons-community
} as const satisfies Record<string, CommunityName>;

export type UIIconName = keyof typeof FEATHER_ICONS | keyof typeof COMMUNITY_ICONS;

export interface UIIconProps {
  name: UIIconName;
  size?: number;
  color?: string;
}

// Com o layout espelhado, as setas precisam apontar para o lado oposto.
const MIRRORED_ICONS: Partial<Record<UIIconName, UIIconName>> = { left: 'right', right: 'left' };

export const UIIcon = ({ name: requestedName, size = 20, color }: UIIconProps) => {
  const name = I18nManager.isRTL ? (MIRRORED_ICONS[requestedName] ?? requestedName) : requestedName;

  if (name in COMMUNITY_ICONS) {
    return (
      <MaterialCommunityIcons
        name={COMMUNITY_ICONS[name as keyof typeof COMMUNITY_ICONS]}
        size={size}
        color={color}
      />
    );
  }

  return (
    <Feather name={FEATHER_ICONS[name as keyof typeof FEATHER_ICONS]} size={size} color={color} />
  );
};
