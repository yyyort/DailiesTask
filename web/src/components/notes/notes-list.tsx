import { NoteType } from "@/model/notes.model";
import React from "react";

import { notesGetAllService } from "@/service/notes/noteService";
import { NotesContainer } from "./notes-container";

export default async function NotesList({ groups }: { groups?: string }) {
  const notes: NoteType[] = await notesGetAllService(groups);

  return (
    <div
      className="w-full min-h-full h-full grid items-start
    phone-sm:grid-cols-2 phone-sm:gap-4 phone-sm:px-4
    laptop:grid-cols-3 laptop:gap-4 laptop:px-6
    2k:grid-cols-4 2k:gap-4 2k:px-8
    "
    >
      {notes.map((note) => (
        <NotesContainer key={note.id} note={note} />
      ))}
    </div>
  );
}
