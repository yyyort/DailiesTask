import { TaskReturnType } from "@/model/task.model";
import { Checkbox } from "../ui/checkbox";
import { taskUpdateStatusService } from "@/service/taskService";
import TaskPopOver from "./task-popover";

export default function TaskContainer({
  task,
}: {
  task: TaskReturnType,
}) {
  return (
    <div className="bg-slate-100 rounded-md p-4 shadow-md border-b-2 border-r-2 border-slate-200 backdrop-blur-md backdrop-filter flex flex-row">
      <div className="flex ml-[-1rem] items-start">
        <TaskPopOver
          task={task}
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">{task.title}</h1>
          <div>
            <Checkbox
              checked={task.status === "done"}
              className="size-7 fill-white bg-white border-slate-400 shadow-xl"
              onClick={async () => {
                "use server";

                await taskUpdateStatusService(
                  task.id,
                  task.status === "done" ? "todo" : "done"
                );
              }}
            />
          </div>
        </div>
        <div className="w-full border-b-2 border-slate-200"></div>
        <div className="flex justify-between">
          <h3 className="text-slate-600 text-sm font-mono">
            {
              //if task is today date, show today instead of date
              task.deadline === new Date().toISOString().split("T")[0]
                ? "Today"
                : task.deadline.slice(5, 10)
            }
          </h3>
          <h3 className="text-slate-600 text-sm font-mono">
            {task.timeToDo.slice(0, 5)}
          </h3>
        </div>
      </div>
    </div>
  );
}