import axios from "axios";
import type { AxiosResponse } from "axios";
import type {
  FetchNotesParams,
  FetchNotesResult,
  NewNotePayload,
  Note,
  NoteTag,
} from "../types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN?.trim() ?? "";

interface ApiNote {
  _id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

interface FetchNotesApiResponse {
  notes: ApiNote[];
  totalPages: number;
}

const notesClient = axios.create({
  baseURL: API_BASE_URL,
});

notesClient.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function toNote(apiNote: ApiNote): Note {
  return {
    id: apiNote._id,
    title: apiNote.title,
    content: apiNote.content,
    tag: apiNote.tag,
    createdAt: apiNote.createdAt,
    updatedAt: apiNote.updatedAt,
  };
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResult> {
  const query: Record<string, string | number> = {
    page: params.page,
    perPage: params.perPage ?? 10,
    sortBy: "updated",
  };

  if (params.search.trim()) {
    query.search = params.search.trim();
  }

  const response: AxiosResponse<FetchNotesApiResponse> = await notesClient.get(
    "/notes",
    {
      params: query,
    },
  );

  return {
    notes: response.data.notes.map(toNote),
    totalPages: response.data.totalPages,
  };
}

export async function createNote(payload: NewNotePayload): Promise<Note> {
  const response: AxiosResponse<ApiNote> = await notesClient.post(
    "/notes",
    payload,
  );

  return toNote(response.data);
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response: AxiosResponse<ApiNote> = await notesClient.delete(
    `/notes/${noteId}`,
  );

  return toNote(response.data);
}
