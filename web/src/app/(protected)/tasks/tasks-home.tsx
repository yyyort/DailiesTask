import TaskContainer from "@/components/tasks/task-container";
import { TaskReturnType } from "@/model/task.model";
import React from "react";

export default function TasksHome({ tasks }: { tasks: TaskReturnType[] }) {
  return (
    <div className="w-full flex flex-col gap-4">
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
