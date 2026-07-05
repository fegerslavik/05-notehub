import { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import type { NewNotePayload } from "../../types/note";
import css from "./App.module.css";

export default function App() {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN?.trim() ?? "";
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canWorkWithNotes = token.trim().length > 0;
  const perPage = 12;

  const debouncedSearch = useDebouncedCallback((nextValue: string) => {
    setPage(1);
    setSearch(nextValue.trim());
  }, 400);

  const notesQuery = useQuery({
    queryKey: ["notes", page, perPage, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
    enabled: canWorkWithNotes,
  });

  const createNoteMutation = useMutation({
    mutationFn: (payload: NewNotePayload) => createNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const notes = notesQuery.data?.notes ?? [];
  const totalPages = notesQuery.data?.totalPages ?? 0;

  function handleSearchChange(value: string) {
    setSearchInput(value);
    debouncedSearch(value);
  }

  async function handleCreateNote(values: NewNotePayload) {
    await createNoteMutation.mutateAsync(values);
    setIsModalOpen(false);
  }

  function handleDeleteNote(noteId: string) {
    deleteNoteMutation.mutate(noteId);
  }

  let errorMessage = "";
  if (notesQuery.error) {
    if (axios.isAxiosError<{ message?: string }>(notesQuery.error)) {
      errorMessage =
        notesQuery.error.response?.data?.message ?? notesQuery.error.message;
    } else {
      errorMessage = "Failed to load notes";
    }
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
          disabled={!canWorkWithNotes}
        >
          Create note +
        </button>
      </header>

      {!canWorkWithNotes && (
        <p className={css.status}>Set VITE_NOTEHUB_TOKEN to load notes.</p>
      )}

      {notesQuery.isPending && canWorkWithNotes && (
        <p className={css.status}>Loading notes...</p>
      )}

      {errorMessage && <p className={css.error}>{errorMessage}</p>}

      {notes.length > 0 && (
        <NoteList
          notes={notes}
          onDelete={handleDeleteNote}
          deleting={deleteNoteMutation.isPending}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className={css.modalTitle}>Create note</h2>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={handleCreateNote}
            isSubmitting={createNoteMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
