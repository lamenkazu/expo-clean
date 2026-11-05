import type { NoteDTO } from '@core/dto/note.dto';
import type { NotesRepository } from '@core/repositories/notes.repository';

export class InMemoryNotesRepository implements NotesRepository {
  public notes: NoteDTO[] = [];

  async list(): Promise<NoteDTO[]> {
    return [...this.notes];
  }

  async findById(id: string): Promise<NoteDTO | null> {
    return this.notes.find(note => note.id === id) ?? null;
  }

  async create(note: NoteDTO): Promise<void> {
    this.notes.push(note);
  }

  async update(note: NoteDTO): Promise<void> {
    this.notes = this.notes.map(current => (current.id === note.id ? note : current));
  }

  async remove(id: string): Promise<void> {
    this.notes = this.notes.filter(note => note.id !== id);
  }
}
