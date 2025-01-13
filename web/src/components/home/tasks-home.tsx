import { TaskReturnType } from "@/model/task.model";

import React from "react";
import TaskContainer from "../tasks/task-container";
import { taskGetAllService } from "@/service/tasks/taskService";

export default async function TasksHome({ date }: { date: string }) {
  const tasks: TaskReturnType[] = await taskGetAllService({
    date: date,
  });
  const tasksDoneLength = tasks.filter((task) => task.status === "done").length;
  const tasksLength = tasks.length;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between">
        <h2
          className="
                text-lg text-foreground font-semibold
                "
        >
          Tasks
        </h2>

        <h2
          className="
            text-sm text-foreground font-semibold
            "
        >
          {tasksDoneLength} / {tasksLength}
        </h2>
      </div>

      <div
        className="
          flex flex-col
          phone-sm:gap-4
          laptop:gap-1
          "
      >
        <h2
          className="
                    text-lg text-slate-800 font-semibold
                "
        ></h2>
        {tasks.map((task) => (
          <TaskContainer key={task.id} task={task} variant="minimal" />
        ))}
      </div>
    </div>
  );
}
