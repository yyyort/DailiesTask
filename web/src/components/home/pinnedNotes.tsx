import { NoteType } from "@/model/notes.model";
import { notesGetAllPinnedController } from "@/service/noteService";
import React from "react";
import { NotesContainer } from "../notes/notes-container";

export default async function PinnedNotes() {
  const pinnedNotes: NoteType[] = await notesGetAllPinnedController();

  return (
    <div
      className="
        w-full min-h-full h-full grid items-start
        phone-sm:grid-cols-2 phone-sm:gap-4
        laptop:grid-cols-3 laptop:gap-4 
      "
    >
      {pinnedNotes.map((note) => (
        <div key={note.id} className="scale-95 ">
          <NotesContainer  note={note} />
        </div>
     
      ))}
    </div>
  );
}
