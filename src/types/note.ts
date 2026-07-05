export const NOTE_TAGS = [
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Todo",
] as const;

export type NoteTag = (typeof NOTE_TAGS)[number];

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesParams {
  page: number;
  search: string;
  perPage?: number;
}

export interface FetchNotesResult {
  notes: Note[];
  totalPages: number;
}

export interface NewNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}
