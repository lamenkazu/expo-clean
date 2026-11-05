import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIIcon, type UIIconName } from '@infra/shared/ui/icon';
import { Modal, Pressable, Text } from 'react-native';

export interface UIMenuItem {
  label: string;
  onPress: () => void;
  icon?: UIIconName;
  tone?: 'default' | 'danger';
}

export interface UIMenuProps {
  visible: boolean;
  onClose: () => void;
  items: UIMenuItem[];
}

export const UIMenu = ({ visible, onClose, items }: UIMenuProps) => {
  const colors = useAppColors();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 px-4 pt-16">
        <Pressable
          onPress={event => event.stopPropagation()}
          accessibilityRole="menu"
          className="self-end rounded-2xl border p-2"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            minWidth: 190,
          }}
        >
          {items.map(item => {
            const isDanger = item.tone === 'danger';
            const iconColor = isDanger ? colors.danger : colors.text;

            return (
              <Pressable
                key={item.label}
                accessibilityRole="menuitem"
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
                className="my-1 flex-row items-center justify-between rounded-xl px-3 py-2"
                style={{ backgroundColor: isDanger ? colors.dangerSoft : colors.surfaceElevated }}
              >
                <Text style={{ color: iconColor }} className="font-medium">
                  {item.label}
                </Text>

                {item.icon ? <UIIcon name={item.icon} size={16} color={iconColor} /> : null}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
};
