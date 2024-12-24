"use server";
import { NoteType } from "@/model/notes.model";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { PinIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { notesGetAllService } from "@/service/noteService";

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

export async function NotesContainer({ note }: { note: NoteType }) {
  return (
    <div
      className="p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between
    phone-sm:w-full phone-sm:p-4 phone-sm:mb-4 phone-sm:min-h-[20rem]
    laptop:min-h-[30rem]
    bg-[#fcfaf7]
    hover:shadow-md hover:border-gray-300
    transition-all
    "
    >
      {/* contents */}
      <div>
        {/* headers */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">
            {
              //limit the length of the note title to 20 characters
              note.title.length > 20
                ? `${note.title.slice(0, 20)}...`
                : note.title
            }
          </h2>

          <div>
            <Button variant="ghost" type="button" className={cn("px-2")}>
              <PinIcon
                className={cn("h-3 w-3")}
                color={note.pinned ? "blue" : "#d1d5db"}
              />
            </Button>
          </div>
        </div>

        {/* content */}
        <div>
          <p
            className="
        phone-sm:block phone-sm:text-sm
        laptop:hidden
        "
          >
            {
              //limit the length of the note content to 100 characters
              note.content.length > 250
                ? `${note.content.slice(0, 250)}...`
                : note.content
            }
          </p>
          <p
            className="
        phone-sm:hidden
        laptop:block
        "
          >
            {
              //limit the length of the note content to 100 characters
              note.content.length > 800
                ? `${note.content.slice(0, 800)} ...`
                : note.content
            }
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-6 items-end">
        {/* dates */}
        <p className="text-xs text-gray-500">
          {note.createdAt === note.updatedAt
            ? `Created: ${note.createdAt}`
            : `Updated: ${note.updatedAt}`}
        </p>
        {/* groups */}
        <div className="flex gap-1">
          {note.group.map((group) => (
            <Badge key={group.id} className="" variant={"default"}>
              {group.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
