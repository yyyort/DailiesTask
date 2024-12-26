import NotesAddForm from "@/components/notes/notes-add-form";
import React from "react";

export default function NotesAdd() {
  return (
    <div
      className="h-screen w-full flex flex-col
    phone-sm:pt-12 pb-5
    "
    >
      {/* titles */}
      <header
        className="
      phone-sm:px-10
      "
      >
        <h1 className="text-2xl font-bold text-foreground text-end">
          Add Notes
        </h1>
      </header>

      {/* form */}
      <section
        className="h-full w-full"
      >
        <NotesAddForm />
      </section>
    </div>
  );
}
