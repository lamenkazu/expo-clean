import { act, renderHook, waitFor } from '@testing-library/react-native';
import { createNote } from '@test/factories/create-note';
import { createTestDependencies, mockDependencyInjection } from '@test/utils/create-test-dependencies';
import { TestProviders } from '@test/utils/providers';

const mockDeps = createTestDependencies();
const mockRouter = { back: jest.fn(), push: jest.fn() };
let mockParams: { noteId?: string } = {};

jest.mock('@infra/app/di/dependency-injection.factory', () => mockDependencyInjection(mockDeps));
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}));

const { useNoteFormViewModel } =
  require('./view-model') as typeof import('./view-model');

const notesRepository = mockDeps.notesRepository;

describe('useNoteFormViewModel', () => {
  beforeEach(() => {
    notesRepository.notes = [];
    mockDeps.analytics.events = [];
    mockRouter.back.mockClear();
  });

  it('cria uma nota nova e volta para a lista', async () => {
    mockParams = { noteId: 'new' };
    const { result: sut } = await renderHook(() => useNoteFormViewModel(), {
      wrapper: TestProviders,
    });

    await act(async () => {
      await sut.current.actions.submit({ title: '  Mercado ', body: 'pao' });
    });

    expect(notesRepository.notes).toHaveLength(1);
    expect(notesRepository.notes[0]?.title).toBe('Mercado');
    expect(mockDeps.analytics.events).toContainEqual({
      name: 'feature_used',
      feature: 'note_created',
    });
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('carrega a nota existente e salva a edicao', async () => {
    const note = createNote({ id: 'n1', title: 'Antes' });
    notesRepository.notes = [note];
    mockParams = { noteId: 'n1' };

    const { result: sut } = await renderHook(() => useNoteFormViewModel(), {
      wrapper: TestProviders,
    });
    await waitFor(() => expect(sut.current.isLoading).toBe(false));

    expect(sut.current.form.getValues('title')).toBe('Antes');
    expect(sut.current.canDelete).toBe(true);

    await act(async () => {
      await sut.current.actions.submit({ title: 'Depois', body: '' });
    });

    expect(notesRepository.notes[0]?.title).toBe('Depois');
  });

  it('avisa quando a nota nao existe', async () => {
    mockParams = { noteId: 'sumiu' };
    const { result: sut } = await renderHook(() => useNoteFormViewModel(), {
      wrapper: TestProviders,
    });

    await waitFor(() => expect(sut.current.isLoading).toBe(false));

    expect(sut.current.error).toBe('Esta nota não existe mais.');
    expect(sut.current.canDelete).toBe(false);
  });
});
