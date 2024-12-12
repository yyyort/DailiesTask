"use server";

import TaskAddButton from "@/components/tasks/task-add-button";
import TaskContainer from "@/components/tasks/task-container";
import TaskFilter from "@/components/tasks/task-filter";

import { TaskReturnType, TaskStatusType } from "@/model/task.model";
import { taskTodayGetService } from "@/service/taskService";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Tasks(
  props: { searchParams: SearchParams }
) {
  const searchParams =  await props.searchParams;

  const filter: TaskStatusType[] = (Array.isArray(searchParams.filter) ? searchParams.filter : [searchParams.filter]).filter(Boolean) as TaskStatusType[];

  const tasks: TaskReturnType[] = await taskTodayGetService(filter);

  return (
    <div
      className="h-screen w-screen flex flex-col
    phone-sm:px-10 phone-sm:py-10
    "
    >
      {/* 
        task today / tasks header
      */}
      <div className="flex flex-col">
        <div className="flex flex-col ml-auto">
          <h1 className="text-2xl text-slate-800 text-end">task today</h1>
          <div className="flex flex-row items-center gap-2 text-slate-600">
            {/* date today */}
            <h3
              className="
                phone-sm:text-sm
              "
            >
              {new Date().toLocaleString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </h3>
          </div>
        </div>

        {/* 
          tasks filter
        */}
        <div className="flex justify-between items-center">
          <TaskFilter />
          <h3 className="text-2xl text-slate-600">
            {tasks.filter((task) => task.status === "done").length} /{" "}
            {tasks.length}
          </h3>
        </div>

        {/* 
          tasks container
        */}
        <div className="flex flex-col gap-4 mt-3">
          <Suspense fallback={<div>Loading...</div>}>
            {tasks.map((task) => (
              <TaskContainer key={task.id} task={task} />
            ))}
          </Suspense>
        </div>

        {/* 
        action button for mobile: adding task 
        */}
        <TaskAddButton />
      </div>
    </div>
  );
}
