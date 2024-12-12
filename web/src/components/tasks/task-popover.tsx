"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EllipsisVerticalIcon } from "lucide-react";
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
        <PopoverContent className="flex flex-col gap-2 w-32">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant={"outline"} onClick={() => {}}>
                Edit
              </Button>
            </SheetTrigger>

            <SheetContent
              side={"bottom"}
              className="h-1/2 flex flex-col justify-around"
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
          >
            Delete
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}
