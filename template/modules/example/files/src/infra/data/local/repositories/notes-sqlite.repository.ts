import type { NoteDTO } from '@core/dto/note.dto';
import { ERROR_CODES } from '@core/error/error-codes';
import type { NotesRepository } from '@core/repositories/notes.repository';
import { db } from '@infra/data/local/db/client';
import { type NoteRow, notes } from '@infra/data/local/db/schema';
import { toAppError } from '@infra/shared/error/to-app-error';
import { desc, eq } from 'drizzle-orm';

const toDTO = (row: NoteRow): NoteDTO => ({
  id: row.id,
  title: row.title,
  body: row.body,
  isPinned: row.isPinned,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export class NotesSqliteRepository implements NotesRepository {
  async list(): Promise<NoteDTO[]> {
    try {
      const rows = await db.select().from(notes).orderBy(desc(notes.updatedAt));
      return rows.map(toDTO);
    } catch (error) {
      throw toAppError(error, ERROR_CODES.NOTES_UNKNOWN);
    }
  }

  async findById(id: string): Promise<NoteDTO | null> {
    try {
      const [row] = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
      return row ? toDTO(row) : null;
    } catch (error) {
      throw toAppError(error, ERROR_CODES.NOTES_UNKNOWN);
    }
  }

  async create(note: NoteDTO): Promise<void> {
    try {
      await db.insert(notes).values(note);
    } catch (error) {
      throw toAppError(error, ERROR_CODES.NOTES_UNKNOWN);
    }
  }

  async update(note: NoteDTO): Promise<void> {
    try {
      await db
        .update(notes)
        .set({
          title: note.title,
          body: note.body,
          isPinned: note.isPinned,
          updatedAt: note.updatedAt,
        })
        .where(eq(notes.id, note.id));
    } catch (error) {
      throw toAppError(error, ERROR_CODES.NOTES_UNKNOWN);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await db.delete(notes).where(eq(notes.id, id));
    } catch (error) {
      throw toAppError(error, ERROR_CODES.NOTES_UNKNOWN);
    }
  }
}
