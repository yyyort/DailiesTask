"use server";

import TaskAddButton from "@/components/tasks/task-add-button";
import TaskContainer from "@/components/tasks/task-container";

import { TaskReturnType } from "@/model/task.model";
import { taskTodayGetService } from "@/service/taskService";
import { Suspense } from "react";

export default async function Tasks() {
  const tasks: TaskReturnType[] = await taskTodayGetService();

  return (
    <div
      className="h-screen w-screen flex flex-col
    phone-sm:px-10 phone-sm:py-10
    "
    >
      <h1
        className="font-extrabold
        phone-sm:text-4xl
      "
      >
        Tasks
      </h1>

      <div className="flex flex-col">
        <div className="flex flex-col ml-auto">
          <h1 className="text-2xl text-slate-800 text-end">task today</h1>
          <div className="flex flex-row items-center gap-2 text-slate-600">
            {/* date today */}
            <h3
              className="
                phone-sm:text-xl
              "
            >
              {new Date().toLocaleString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </h3>
            <h3 className="text-2xl text-slate-600">
              {tasks.filter((task) => task.status === "done").length} /{" "}
              {tasks.length}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-3">
          <Suspense fallback={<div>Loading...</div>}>
            {tasks.map((task) => (
              <TaskContainer {...task} key={task.id} />
            ))}
          </Suspense>
        </div>

        {/* action button for mobile: adding task */}
        <TaskAddButton />
      </div>
    </div>
  );
}
