import type { Note } from "./note";

export interface FetchNotesParams {
  page: number;
  search: string;
  perPage?: number;
}

export interface FetchNotesResult {
  notes: Note[];
  totalPages: number;
}
