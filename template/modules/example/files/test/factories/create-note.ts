import type { NoteDTO } from '@core/dto/note.dto';

let sequence = 0;

export const createNote = (override: Partial<NoteDTO> = {}): NoteDTO => {
  sequence += 1;

  return {
    id: `note-${sequence}`,
    title: `Nota ${sequence}`,
    body: '',
    isPinned: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...override,
  };
};
