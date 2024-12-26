"use client";
import React from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function NotesAddButton() {
  const router = useRouter();

  return (
    <Button
      className="flex flex-row items-center gap-2 ml-auto
                phone-sm:text-xl phone-sm:p-4 phone-sm:py-6
              "
      onClick={() => {
        //navigate to the add notes page
        router.push("/notes/add");
      }}
    >
      <PlusIcon className="size-full dark:text-teal-50" />
      <p>Add Note</p>
    </Button>
  );
}
