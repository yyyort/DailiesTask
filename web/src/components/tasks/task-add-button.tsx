"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import TaskAddForm from "./task-add-form";
import { PlusIcon } from "@radix-ui/react-icons";
import useWindowSize from "@/hooks/useWindow";

export default function TaskAddButton() {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const size = useWindowSize();

  console.log(size);

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <div className="">
            {/* action button for mobile: adding task */}
            <Button
              className="flex flex-row items-center gap-2 p-7 text-2xl"
              onClick={() => setSheetOpen(true)}
            >
              <PlusIcon className="size-full" />
              <p>Add task</p>
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent side={
          size.width ?? 0 > 640 ? "right" : "bottom"
        } className="flex flex-col
          tablet:max-w-[30rem]
        ">
          <SheetHeader>
            <SheetTitle className="text-start text-2xl font-bold">
              Add Task
            </SheetTitle>
          </SheetHeader>

          {/* form */}
          <TaskAddForm setSheetOpen={setSheetOpen} />
        </SheetContent>
      </Sheet>
    </>
  );
}
