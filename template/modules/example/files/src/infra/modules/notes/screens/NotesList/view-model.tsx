import { togglePin } from '@core/domain/notes';
import type { NoteDTO } from '@core/dto/note.dto';
import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { useToast } from '@infra/app/providers/toast-provider';
import { useScreenTour } from '@infra/app/providers/tour-provider';
import { toUserMessage } from '@infra/shared/error/to-app-error';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { NEW_NOTE_ID } from '../NoteForm/model';
import { toListItems } from './model';

const notesRepository = DependencyInjectionFactory.getInstance().getNotesRepository();

type ViewModelState = {
  notes: NoteDTO[];
  isLoading: boolean;
  error: string | null;
};

export const useNotesListViewModel = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [state, setState] = useState<ViewModelState>({ notes: [], isLoading: true, error: null });

  useScreenTour('notes', !state.isLoading);

  const reload = useCallback(async () => {
    try {
      const notes = await notesRepository.list();
      setState({ notes, isLoading: false, error: null });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: toUserMessage(error) }));
    }
  }, []);

  // A lista volta a ser lida sempre que a aba ganha foco, inclusive depois de editar uma nota.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const onTogglePin = useCallback(
    async (id: string) => {
      const note = state.notes.find(current => current.id === id);

      if (!note) {
        return;
      }

      try {
        await notesRepository.update(togglePin(note, new Date()));
        await reload();
      } catch (error) {
        showToast(toUserMessage(error), 'error');
      }
    },
    [reload, showToast, state.notes]
  );

  const actions = useMemo(
    () => ({
      setQuery,
      reload,
      togglePin: onTogglePin,
      openNote: (id: string) => router.push({ pathname: '/notes/[noteId]', params: { noteId: id } }),
      createNote: () =>
        router.push({ pathname: '/notes/[noteId]', params: { noteId: NEW_NOTE_ID } }),
    }),
    [onTogglePin, reload, router]
  );

  return {
    query,
    items: toListItems(state.notes, query),
    hasNotes: state.notes.length > 0,
    isLoading: state.isLoading,
    error: state.error,
    actions,
  };
};
