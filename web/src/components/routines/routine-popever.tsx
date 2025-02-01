"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2Icon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { RoutineReturnType } from "@/model/routine.model";
import RoutineEditForm from "./routine-edit-form";
import { routineDeleteService } from "@/service/routines/routineActions";
import { convertDateTimeUTCtoLocal } from "../tasks/task-container";

export default function RoutinePopOver({
  routine,
}: {
  routine: RoutineReturnType;
}) {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const reformattedTasks =
    routine.tasks?.map((task) => {
      //convert time to 24 hour format and local time
      const formattedTime = convertDateTimeUTCtoLocal(
        `${task.deadline}T${task.timeToDo}`,
        false
      );

      return {
        ...task,
        timeToDo: formattedTime,
      };
    }) ?? [];

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <EllipsisVerticalIcon className="size-7" />
        </PopoverTrigger>
        <PopoverContent
          className="flex flex-col gap-2 w-32 
        phone-sm:mx-10
        laptop:ml-20
        "
        >
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant={"outline"} className="flex gap-2 justify-start">
                <Edit2Icon />
                <p>Edit</p>
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
                  Edit Task
                </SheetTitle>
              </SheetHeader>

              {/* form */}
              <RoutineEditForm
                routine={{
                  ...routine,
                  tasks: reformattedTasks,
                }}
                setSheetOpen={setSheetOpen}
              />
            </SheetContent>
          </Sheet>
          <Button
            variant={"outline"}
            onClick={async () => {
              // delete routine
              await routineDeleteService(routine.id);
            }}
          >
            <Trash2Icon />
            <p>Delete</p>
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}
