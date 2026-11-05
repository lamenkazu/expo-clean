import { filterNotes, sortNotes, toPreview } from '@core/domain/notes';
import type { NoteDTO } from '@core/dto/note.dto';

export type NoteListItem = {
  id: string;
  title: string;
  preview: string;
  isPinned: boolean;
};

export const toListItems = (notes: NoteDTO[], query: string): NoteListItem[] =>
  sortNotes(filterNotes(notes, query)).map(note => ({
    id: note.id,
    title: note.title,
    preview: toPreview(note.body),
    isPinned: note.isPinned,
  }));
