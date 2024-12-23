"use server";
import { NoteType } from "@/model/notes.model";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { PinIcon } from "lucide-react";
import { Badge } from "../ui/badge";

export default async function NotesList() {
  const mockNotes: NoteType[] = [
    {
      id: "1",
      userId: "1",
      title: "Groceries",
      pinned: false,
      group: ["groceries", "important"],
      content: "Milk, eggs, bread",
      createdAt: "2021-10-10",
      updatedAt: "2021-10-10",
    },
    {
      id: "2",
      userId: "1",
      title: "Important",
      pinned: true,
      group: ["important"],
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      createdAt: "2021-10-10",
      updatedAt: "2021-10-15",
    },
    {
      id: "3",
      userId: "1",
      title: "Class Note",
      pinned: false,
      group: ["class note"],
      content:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
      createdAt: "2021-10-10",
      updatedAt: "2021-10-10",
    },
    {
      id: "4",
      userId: "1",
      title: "other note",
      pinned: false,
      group: ["class note"],
      content:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
      createdAt: "2021-10-10",
      updatedAt: "2021-10-12",
    },
    {
      id: "5",
      userId: "1",
      title: "Important",
      pinned: true,
      group: ["important"],
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      createdAt: "2021-10-10",
      updatedAt: "2021-10-15",
    },
  ];

  const notes: NoteType[] = mockNotes;

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
            <Badge key={group} className="" variant={"default"}>
              {group}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
