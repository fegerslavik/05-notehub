import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  deleting: boolean;
}

export default function NoteList({ notes, onDelete, deleting }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note, index) => (
        <li
          key={`${note.id || "note"}-${note.updatedAt}-${note.title}-${index}`}
          className={css.listItem}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              type="button"
              onClick={() => onDelete(note.id)}
              disabled={deleting}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
