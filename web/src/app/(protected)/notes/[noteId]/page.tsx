"use server";

import NotesEditForm from "@/components/notes/note-edit-form";
import { NoteType } from "@/model/notes.model";
import { notesGetSerive } from "@/service/notes/noteService";

type Params = Promise<{ noteId: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const slug = params.noteId;

  const note: NoteType = await notesGetSerive(slug);

  return (
    <div
      className="h-screen w-full flex flex-col
        phone-sm:pt-12 pb-5
        "
    >
      {/* titles */}
      <header
        className="
          phone-sm:px-10 pb-4
          "
      >
        <h1 className="text-2xl font-bold text-foreground text-end">
          Edit Notes
        </h1>
      </header>

      {/* form */}
      <section className="h-full w-full">
        <NotesEditForm note={note} />
      </section>
    </div>
  );
}
