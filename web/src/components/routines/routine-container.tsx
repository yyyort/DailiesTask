import { RoutineReturnType } from "@/model/routine.model";
import React from "react";
import TaskContainer from "../tasks/task-container";

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
        bg-slate-100 bg-opacity-10
        rounded-md shadow-md border-slate-100 border-b-2 border-r-2
        hover:border-slate-200 hover:border-b-4 hover:shadow-lg
      "
    >
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">{routine.title}</h1>
        {/* count */}
        <h3 className="font-thin text-lg text-slate-500">
          {taskDone} / {taskTotal}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {routine.tasks?.map((task) => (
          <TaskContainer key={task.id} task={task} variant="routine" />
        ))}
      </div>
    </div>
  );
}
