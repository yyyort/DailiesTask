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
import { PlusIcon } from "@radix-ui/react-icons";
import RoutineAddForm from "./routine-add-form";

export default function TaskAddButton() {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          {/* action button for mobile: adding task */}
          <Button
            className="flex flex-row items-center gap-2
                phone-sm:text-xl phone-sm:p-4 phone-sm:py-6
              "
            onClick={() => setSheetOpen(true)}
          >
            <PlusIcon className="size-full" />
            <p>Add Routine</p>
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"right"}
          className="flex flex-col h-full overflow-auto
          tablet:max-w-[30rem]
          laptop:max-w-[40rem]
        "
        >
          <SheetHeader>
            <SheetTitle className="text-start text-2xl font-bold">
              Add Routine
            </SheetTitle>
          </SheetHeader>

          {/* form */}
          <RoutineAddForm setSheetOpen={setSheetOpen} />
        </SheetContent>
      </Sheet>
    </>
  );
}
