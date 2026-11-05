import {
  applyDraft,
  buildNote,
  filterNotes,
  normalizeTitle,
  sortNotes,
  togglePin,
  toPreview,
} from '@core/domain/notes';
import { createNote } from '@test/factories/create-note';

const NOW = new Date('2026-01-10T12:00:00.000Z');

describe('notes', () => {
  it('normaliza o titulo', () => {
    expect(normalizeTitle('  Lista   de   compras ')).toBe('Lista de compras');
  });

  it('cria a nota com as datas do momento informado', () => {
    const sut = buildNote({ id: 'n1', draft: { title: ' Ideia ', body: ' texto ' }, now: NOW });

    expect(sut).toEqual({
      id: 'n1',
      title: 'Ideia',
      body: 'texto',
      isPinned: false,
      createdAt: NOW.toISOString(),
      updatedAt: NOW.toISOString(),
    });
  });

  it('atualiza o texto e a data de edicao', () => {
    const note = createNote({ updatedAt: '2026-01-01T00:00:00.000Z' });
    const sut = applyDraft(note, { title: 'Novo', body: 'corpo' }, NOW);

    expect(sut.title).toBe('Novo');
    expect(sut.updatedAt).toBe(NOW.toISOString());
    expect(sut.createdAt).toBe(note.createdAt);
  });

  it('ordena as fixadas primeiro e depois as mais recentes', () => {
    const old = createNote({ id: 'old', updatedAt: '2026-01-01T00:00:00.000Z' });
    const recent = createNote({ id: 'recent', updatedAt: '2026-01-05T00:00:00.000Z' });
    const pinned = togglePin(createNote({ id: 'pinned' }), new Date('2025-12-01T00:00:00.000Z'));

    expect(sortNotes([old, recent, pinned]).map(note => note.id)).toEqual([
      'pinned',
      'recent',
      'old',
    ]);
  });

  it('busca sem diferenciar acentos e maiusculas', () => {
    const notes = [
      createNote({ id: 'a', title: 'Reunião', body: '' }),
      createNote({ id: 'b', title: 'Mercado', body: 'Comprar pão' }),
    ];

    expect(filterNotes(notes, 'REUNIAO').map(note => note.id)).toEqual(['a']);
    expect(filterNotes(notes, 'pao').map(note => note.id)).toEqual(['b']);
    expect(filterNotes(notes, '  ')).toHaveLength(2);
  });

  it('resume o texto em uma linha', () => {
    expect(toPreview('linha 1\nlinha 2', 10)).toBe('linha 1 l…');
  });
});
