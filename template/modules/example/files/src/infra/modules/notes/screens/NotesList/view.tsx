import { UITourTarget } from '@infra/app/providers/tour-provider';
import { useAppColors, useAppSurfaces } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UIIconButton } from '@infra/shared/ui/icon-button';
import { UIInput } from '@infra/shared/ui/input';
import { UIMessage } from '@infra/shared/ui/message';
import { UIScreen } from '@infra/shared/ui/screen';
import { UIPageTitle } from '@infra/shared/ui/typography';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import type { NoteListItem } from './model';
import { useNotesListViewModel } from './view-model';

const NoteRow = ({
  item,
  isFirst,
  isLast,
  onPress,
  onTogglePin,
}: {
  item: NoteListItem;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
  onTogglePin: () => void;
}) => {
  const { t } = useTranslation('notes');
  const colors = useAppColors();
  const surfaces = useAppSurfaces();

  return (
    <View className="flex-row items-center gap-3 p-4" style={surfaces.groupRow(isFirst, isLast)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityHint={t('list.openHint')}
        className="min-w-0 flex-1"
      >
        <Text numberOfLines={1} style={{ color: colors.text }} className="text-base font-semibold">
          {item.title}
        </Text>
        {item.preview ? (
          <Text numberOfLines={1} style={{ color: colors.textMuted }} className="mt-0.5 text-sm">
            {item.preview}
          </Text>
        ) : null}
      </Pressable>

      <UIIconButton
        icon="star"
        size="sm"
        tone={item.isPinned ? 'danger' : 'default'}
        onPress={onTogglePin}
        accessibilityLabel={item.isPinned ? t('list.unpin') : t('list.pin')}
      />
    </View>
  );
};

export const NotesListView = () => {
  const { t } = useTranslation('notes');
  const colors = useAppColors();
  const { query, items, hasNotes, isLoading, error, actions } = useNotesListViewModel();

  return (
    <UIScreen padded={false} bottomInset={false}>
      <View className="gap-3 px-4 pt-4">
        <View className="flex-row items-center justify-between">
          <UIPageTitle>{t('list.title')}</UIPageTitle>
          <UITourTarget id="notes.add">
            <UIButton label={t('list.add')} size="sm" onPress={actions.createNote} />
          </UITourTarget>
        </View>

        {hasNotes ? (
          <UIInput
            value={query}
            onChangeText={actions.setQuery}
            placeholder={t('list.search')}
            accessibilityLabel={t('list.search')}
            returnKeyType="search"
          />
        ) : null}

        <UIMessage tone="error" message={error} />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <UITourTarget id="notes.list" className="flex-1">
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            contentContainerClassName="p-4"
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <NoteRow
                item={item}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                onPress={() => actions.openNote(item.id)}
                onTogglePin={() => actions.togglePin(item.id)}
              />
            )}
            ListEmptyComponent={
              <Text style={{ color: colors.textMuted }} className="py-10 text-center">
                {hasNotes ? t('list.noResults') : t('list.empty')}
              </Text>
            }
          />
        </UITourTarget>
      )}
    </UIScreen>
  );
};
