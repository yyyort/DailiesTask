import TaskContainer from "@/components/tasks/task-container";
import { TaskReturnType } from "@/model/task.model";
import { taskGetAllService, taskTodayGetService } from "@/service/tasks/taskService";

import React from "react";

export default async function TasksLaptop({
  filter,
  dateFilter,
}: {
  filter: string;
  dateFilter: string;
}) {
  const tasks: TaskReturnType[] = [];
  //if date today fetch todays tasks else fe
  if (dateFilter === new Date().toLocaleDateString() || !dateFilter) {
    const res = await taskTodayGetService(filter);

    tasks.push(...res);
  } else if (dateFilter && dateFilter !== new Date().toLocaleDateString()) {
    const res = await taskGetAllService(dateFilter, filter);

    tasks.push(...res);
  }

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const doneTasks = tasks.filter((task) => task.status === "done");
  const overdueTasks = tasks.filter((task) => task.status === "overdue");

  return (
    <div
      className="
        grid
        laptop:grid-cols-2
        desktop:grid-cols-3
        gap-x-8
        gap-y-4
    "
    >
      <div>
        <h2
          className="
                text-2xl text-foreground font-semibold mb-3
            "
        >
          To do
        </h2>
        {todoTasks.map((task) => (
          <TaskContainer key={task.id} task={task} />
        ))}
      </div>
      <div>
        <h2
          className="
                text-2xl text-foreground font-semibold mb-3
            "
        >
          Done
        </h2>
        {doneTasks.map((task) => (
          <TaskContainer key={task.id} task={task} />
        ))}
      </div>
      <div>
        <h2
          className="
                text-2xl text-foreground font-semibold mb-3
            "
        >
          Overdue
        </h2>
        {overdueTasks.map((task) => (
          <TaskContainer key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
