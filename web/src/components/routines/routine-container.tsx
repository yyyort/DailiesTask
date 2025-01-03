import { RoutineReturnType } from "@/model/routine.model";
import React from "react";
import TaskContainer from "../tasks/task-container";
import RoutinePopOver from "./routine-popever";

export default function RoutineContainer({
  routine,
}: {
  routine: RoutineReturnType;
}) {
  const taskDone = routine.tasks?.filter(
    (task) => task.status === "done"
  ).length;
  const taskTotal = routine.tasks?.length;

  return (
    <div
      className="
        flex flex-col gap-2  p-4 
        rounded-md shadow-md border-primary border-b-2 border-r-2 border-l-[0.5px] border-t-[0.5px]
        dark:border-t-green-950 border-t-green-100
        dark:border-l-green-950 border-l-green-100
      "
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <RoutinePopOver routine={routine} />
          <h1 className="font-bold text-2xl">{routine.title}</h1>
        </div>

        {/* count */}
        <h3 className="font-thin text-lg text-slate-500">
          {taskDone} / {taskTotal}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {routine.tasks?.map((task) => (
          <TaskContainer
            key={task.id}
            task={{
              id: task.id,
              title: task.title,
              description: task.description,
              status: task.status,
              timeToDo: task.timeToDo,
              deadline: task.deadline,
              type: task.type,
            }}
            variant="routine"
          />
        ))}
      </div>
    </div>
  );
}
