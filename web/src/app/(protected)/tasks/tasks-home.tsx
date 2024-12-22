import TaskContainer from "@/components/tasks/task-container";
import { TaskReturnType } from "@/model/task.model";
import React from "react";

export default function TasksHome({ tasks }: { tasks: TaskReturnType[] }) {
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const doneTasks = tasks.filter((task) => task.status === "done");
  const overdueTasks = tasks.filter((task) => task.status === "overdue");

  return (
    <div
      className="
        grid
        laptop:grid-cols-2
        desktop:grid-cols-3
        gap-4
    "
    >
      <div>
        <h2
          className="
                text-xl text-slate-800 font-semibold
            "
        >
          To do
        </h2>
        {todoTasks.map((task) => (
          <TaskContainer key={task.id} task={task} variant="minimal" />
        ))}
      </div>
      <div>
        <h2
          className="
                text-xl text-slate-800 font-semibold
            "
        >
          Done
        </h2>
        {doneTasks.map((task) => (
          <TaskContainer key={task.id} task={task} variant="minimal" />
        ))}
      </div>
      <div>
        <h2
          className="
                text-xl text-slate-800 font-semibold
            "
        >
          Overdue
        </h2>
        {overdueTasks.map((task) => (
          <TaskContainer key={task.id} task={task} variant="minimal" />
        ))}
      </div>
    </div>
  );
}
