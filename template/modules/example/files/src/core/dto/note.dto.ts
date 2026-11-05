export type NoteDTO = {
  id: string;
  title: string;
  body: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NoteDraftDTO = {
  title: string;
  body: string;
};
