import NotesAddButton from "@/components/notes/notes-add-button";
import NotesList from "@/components/notes/notes-container";
import NotesFilter from "@/components/notes/notes-filters";
import React from "react";

export default function Notes() {
  return (
    <div
      className="h-screen w-full flex flex-col
    phone-sm:pt-12 pb-5
    "
    >
      <div className="py-2">
        {/* titles  */}
        <header
          className="
      phone-sm:px-10
      "
        >
          <h1 className="text-2xl font-bold text-slate-900 text-end">Notes</h1>
        </header>

        <div className="flex justify-between items-end">
          {/* filters */}
          <section
            className="flex overflow-auto
      phone-sm:px-10
      "
          >
            <NotesFilter />
          </section>

          {/* add button */}
          <section
            className="
      phone-sm:absolute phone-sm:right-4 phone-sm:bottom-10
      laptop:static laptop:pt-6 laptop:px-10
      "
          >
            <NotesAddButton />
          </section>
        </div>
      </div>

      {/* notes */}
      <div className="h-full w-full overflow-y-auto pt-6">
        <NotesList />
      </div>
    </div>
  );
}
