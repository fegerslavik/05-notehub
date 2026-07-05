import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import { NOTE_TAGS, type NewNotePayload } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<NewNotePayload["tag"]>()
    .oneOf(NOTE_TAGS, "Select a valid tag")
    .required("Tag is required"),
});

const initialValues: NewNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: (payload: NewNotePayload) => createNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  let submitError = "";
  if (createNoteMutation.error) {
    if (axios.isAxiosError<{ message?: string }>(createNoteMutation.error)) {
      submitError =
        createNoteMutation.error.response?.data?.message ??
        createNoteMutation.error.message;
    } else {
      submitError = "Failed to create note";
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        await createNoteMutation.mutateAsync(values);
        helpers.resetForm();
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              className={css.input}
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <select
              id="tag"
              name="tag"
              className={css.select}
              value={values.tag}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </select>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          {submitError && <span className={css.error}>{submitError}</span>}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={createNoteMutation.isPending}
            >
              Create note
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
