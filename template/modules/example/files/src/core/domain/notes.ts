import type { NoteDraftDTO, NoteDTO } from '@core/dto/note.dto';

export const NOTE_TITLE_MAX = 120;
export const NOTE_BODY_MAX = 5000;

export const normalizeTitle = (title: string): string => title.trim().replace(/\s+/g, ' ');

// Hora e id chegam de fora para o teste controlar o resultado.
export const buildNote = ({
  id,
  draft,
  now,
}: {
  id: string;
  draft: NoteDraftDTO;
  now: Date;
}): NoteDTO => ({
  id,
  title: normalizeTitle(draft.title),
  body: draft.body.trim(),
  isPinned: false,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
});

export const applyDraft = (note: NoteDTO, draft: NoteDraftDTO, now: Date): NoteDTO => ({
  ...note,
  title: normalizeTitle(draft.title),
  body: draft.body.trim(),
  updatedAt: now.toISOString(),
});

export const togglePin = (note: NoteDTO, now: Date): NoteDTO => ({
  ...note,
  isPinned: !note.isPinned,
  updatedAt: now.toISOString(),
});

// Fixadas primeiro, depois as editadas mais recentemente.
export const sortNotes = (notes: NoteDTO[]): NoteDTO[] =>
  [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    return b.updatedAt.localeCompare(a.updatedAt);
  });

const foldText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Busca sem diferenciar acentos nem maiusculas, no titulo e no texto.
export const filterNotes = (notes: NoteDTO[], query: string): NoteDTO[] => {
  const needle = foldText(query.trim());

  if (!needle) {
    return notes;
  }

  return notes.filter(note => foldText(`${note.title} ${note.body}`).includes(needle));
};

export const toPreview = (body: string, max = 90): string => {
  const singleLine = body.replace(/\s+/g, ' ').trim();
  return singleLine.length > max ? `${singleLine.slice(0, max - 1)}…` : singleLine;
};
