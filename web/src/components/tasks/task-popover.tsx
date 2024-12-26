"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EditIcon, EllipsisVerticalIcon, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { TaskReturnType } from "@/model/task.model";
import TaskEditForm from "./task-edit-form";
import { taskDeleteService } from "@/service/taskService";

export default function TaskPopOver({ task }: { task: TaskReturnType }) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
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
                <EditIcon />
                <p>edit</p>
              </Button>
            </SheetTrigger>

            <SheetContent
              side={"right"}
              className="flex flex-col"
            >
              <SheetHeader>
                <SheetTitle className="text-start text-2xl font-bold">
                  Edit Task
                </SheetTitle>
              </SheetHeader>

              {/* form */}
              <TaskEditForm setSheetOpen={setSheetOpen} task={task} />
            </SheetContent>
          </Sheet>
          <Button
            variant={"outline"}
            onClick={async () => {
              taskDeleteService(task.id);
            }}
            className="flex gap-2 justify-start"
          >
            <Trash />
            <p>delete</p>
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}
