import type { NoteDTO } from '@core/dto/note.dto';

export interface NotesRepository {
  list(): Promise<NoteDTO[]>;
  findById(id: string): Promise<NoteDTO | null>;
  create(note: NoteDTO): Promise<void>;
  update(note: NoteDTO): Promise<void>;
  remove(id: string): Promise<void>;
}
