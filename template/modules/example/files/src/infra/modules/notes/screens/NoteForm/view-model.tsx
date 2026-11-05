import { applyDraft, buildNote } from '@core/domain/notes';
import type { NoteDTO } from '@core/dto/note.dto';
import { AppError } from '@core/error/AppError';
import { ERROR_CODES } from '@core/error/error-codes';
import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { useToast } from '@infra/app/providers/toast-provider';
import { toUserMessage } from '@infra/shared/error/to-app-error';
import { createId } from '@infra/shared/utils/create-id';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  defaultValues,
  fromNote,
  NEW_NOTE_ID,
  type NoteFormData,
  noteFormSchema,
  toDraft,
} from './model';

const di = DependencyInjectionFactory.getInstance();
const notesRepository = di.getNotesRepository();
const analytics = di.getAnalyticsService();

const NOT_FOUND_ERROR = new AppError({ code: ERROR_CODES.NOTES_NOT_FOUND, message: 'Note not found' });

type ViewModelState = {
  note: NoteDTO | null;
  isLoading: boolean;
  isDeleting: boolean;
  error: string | null;
};

export const useNoteFormViewModel = () => {
  const { t } = useTranslation('notes');
  const router = useRouter();
  const { showToast } = useToast();
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const isNew = !noteId || noteId === NEW_NOTE_ID;

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues,
    mode: 'onChange',
  });
  const { reset } = form;

  const [state, setState] = useState<ViewModelState>({
    note: null,
    isLoading: !isNew,
    isDeleting: false,
    error: null,
  });

  useEffect(() => {
    if (isNew) {
      return;
    }

    let isMounted = true;

    notesRepository
      .findById(noteId)
      .then(note => {
        if (!isMounted) {
          return;
        }

        if (note) {
          reset(fromNote(note));
        }

        setState(prev => ({
          ...prev,
          note,
          isLoading: false,
          error: note ? null : toUserMessage(NOT_FOUND_ERROR),
        }));
      })
      .catch(error => {
        if (isMounted) {
          setState(prev => ({ ...prev, isLoading: false, error: toUserMessage(error) }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isNew, noteId, reset]);

  const submit = useCallback(
    async (data: NoteFormData) => {
      setState(prev => ({ ...prev, error: null }));
      const now = new Date();

      try {
        if (isNew || !state.note) {
          await notesRepository.create(buildNote({ id: createId(), draft: toDraft(data), now }));
          analytics.track({ name: 'feature_used', feature: 'note_created' });
        } else {
          await notesRepository.update(applyDraft(state.note, toDraft(data), now));
        }

        showToast(t('form.saved'), 'success');
        router.back();
      } catch (error) {
        setState(prev => ({ ...prev, error: toUserMessage(error) }));
      }
    },
    [isNew, router, showToast, state.note, t]
  );

  const remove = useCallback(async () => {
    if (!state.note) {
      return;
    }

    setState(prev => ({ ...prev, isDeleting: true }));

    try {
      await notesRepository.remove(state.note.id);
      showToast(t('form.deleted'));
      router.back();
    } catch (error) {
      setState(prev => ({ ...prev, isDeleting: false, error: toUserMessage(error) }));
    }
  }, [router, showToast, state.note, t]);

  const actions = useMemo(
    () => ({ submit, remove, back: router.back }),
    [remove, router.back, submit]
  );

  return {
    form,
    isNew,
    canDelete: !isNew && state.note !== null,
    isLoading: state.isLoading,
    isDeleting: state.isDeleting,
    error: state.error,
    actions,
  };
};
