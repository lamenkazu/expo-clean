import { NOTE_BODY_MAX, NOTE_TITLE_MAX } from '@core/domain/notes';
import type { NoteDraftDTO, NoteDTO } from '@core/dto/note.dto';
import { z } from 'zod';

export const NEW_NOTE_ID = 'new';

// As mensagens sao chaves do i18n: a view traduz, e o schema continua puro.
export const noteFormSchema = z.object({
  title: z.string().trim().min(1, 'validation:required').max(NOTE_TITLE_MAX, 'validation:tooLong'),
  body: z.string().max(NOTE_BODY_MAX, 'validation:tooLong'),
});

export type NoteFormData = z.infer<typeof noteFormSchema>;

export const defaultValues: NoteFormData = { title: '', body: '' };

export const LIMITS = { title: NOTE_TITLE_MAX, body: NOTE_BODY_MAX } as const;

export const toDraft = (data: NoteFormData): NoteDraftDTO => ({
  title: data.title,
  body: data.body,
});

export const fromNote = (note: NoteDTO): NoteFormData => ({ title: note.title, body: note.body });
