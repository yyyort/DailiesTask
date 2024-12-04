"use client"

import React from "react";
import { Button } from "../ui/button";
import plusWhite from "@/assets/logo/plus-white.svg";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import TaskAddForm from "./task-add-form";

export default function TaskAddButton() {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <>
      <Sheet
        open={sheetOpen}
       onOpenChange={setSheetOpen}
      >
        <SheetTrigger asChild
          
        >
          <div className="absolute right-5 bottom-20">
            {/* action button for mobile: adding task */}
            <Button className="rounded-full size-20"
              onClick={() => setSheetOpen(true)}
            >
              <Image
                src={plusWhite}
                alt="plus"
                width={50}
                height={50}
                className=""
              />
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent
          side={"bottom"}
          className="h-1/2 flex flex-col justify-around"
        >
          <SheetHeader>
            <SheetTitle className="text-start text-2xl font-bold">
              Add Task
            </SheetTitle>
          </SheetHeader>

          {/* form */}
          <TaskAddForm
            setSheetOpen={setSheetOpen}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
