"use client";
import { cn } from "@/lib/utils";
import { EllipsisVerticalIcon, PinIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  notesDeleteService,
  notesUpdatePinnedService,
} from "@/service/notes/notesAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { NoteType } from "@/model/notes.model";

export function NotesContainer({ note }: { note: NoteType }) {
  return (
    <Link href={`/notes/${note.id}`} className="z-0">
      <div
        className="p-4 border border-secondary rounded-lg shadow-sm flex flex-col justify-between
      phone-sm:w-full phone-sm:p-4 phone-sm:mb-4 phone-sm:min-h-[20rem]
      laptop:min-h-[30rem]
      bg-secondary
      hover:shadow-md hover:border-ring
      transition-all
      "
      >
        {/* contents */}
        <div>
          {/* headers */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-foreground">
              {
                //limit the length of the note title to 20 characters
                note.title.length > 20
                  ? `${note.title.slice(0, 20)}...`
                  : note.title
              }
            </h2>

            <div className="flex gap-2">
              <button
                type="button"
                className={cn("px-2")}
                onClick={async (event) => {
                  event.stopPropagation();
                  event.preventDefault();

                  try {
                    await notesUpdatePinnedService(note.id, !note.pinned);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <PinIcon
                  className={cn(
                    "h-5 w-5 hover:text-green-600",
                    note.pinned
                      ? "dark:text-green-300 text-green-600 stroke-2"
                      : "text-gray-700 stroke-1"
                  )}
                />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="z-10 hover:scale-150"
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                    }}
                  >
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/notes/${note.id}`}
                      className="flex gap-2 items-center w-full cursor-pointer z-10"
                    >
                      <Pencil1Icon className="h-4 w-4" />
                      <p>edit</p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      className="flex gap-2 items-center w-full cursor-pointer z-10"
                      onClick={async (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        try {
                          await notesDeleteService(note.id);
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                      <p>delete</p>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* content */}
          <div>
            <div
              className="text-sm text-foreground
                        phone-sm:block
                        laptop:hidden
                "
              dangerouslySetInnerHTML={
                //parse the note content as HTML
                {
                  __html:
                    note.content.length > 250
                      ? `${note.content.slice(0, 250)}...`
                      : note.content,
                }
              }
            />

            <div
              className="text-sm text-foreground
                        phone-sm:hidden
                        laptop:block
                "
              dangerouslySetInnerHTML={
                //parse the note content as HTML
                {
                  __html:
                    note.content.length > 800
                      ? `${note.content.slice(0, 800)} ...`
                      : note.content,
                }
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 items-end">
          {/* dates */}
          <p className="text-xs text-gray-500">
            {note.createdAt === note.updatedAt
              ? `Created: ${new Date(note.createdAt).toLocaleString()}`
              : `Updated: ${new Date(note.updatedAt).toLocaleString()}`}
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
    </Link>
  );
}
