import { TaskReturnType } from "@/model/task.model";
import { Checkbox } from "../ui/checkbox";
import TaskPopOver from "./task-popover";
import { cn } from "@/lib/utils";
import { taskUpdateStatusService } from "@/service/tasks/taskActions";

export default function TaskContainer({
  task,
  variant = "default",
  type,
}: {
  task: TaskReturnType;
  variant?: string;
  type?: string;
}) {
  return (
    <div
      className={cn(
        `bg-card rounded-md shadow-md border-b-2 border-r-2 border-primary backdrop-blur-md backdrop-filter flex flex-row
      laptop:mb-4
    `,
        task.status === "overdue" && "border-red-600",
        variant === "routine" && "p-4",
        variant === "default" && "p-4",
        variant === "minimal" && "p-2 px-4 items-center"
      )}
    >
      {variant === "default" && (
        <div className="flex ml-[-1rem] items-start">
          <TaskPopOver task={task} />
        </div>
      )}

      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between">
          <div
            className={cn(
              "flex flex-col w-full overflow-auto",
              variant === "routine" &&
                "flex-row items-center justify-between pr-2  gap-2",
              variant === "default" && "flex-col gap-2"
            )}
          >
            <div>
              {/* titles */}
              <h1
                className={cn(
                  "text-2xl font-semibold",
                  variant === "routine" && "text-xl",
                  variant === "minimal" && "text-md",
                  task.status === "done" &&
                    "line-through text-secondary-foreground"
                )}
              >
                {task.title}
              </h1>

              {/* addons for routines*/}
              {variant === "routine" && (
                <div>
                  <h3 className="text-muted-foreground text-xs">
                    {type === "routineTask" ? "task is deleted in today" : ""}
                  </h3>
                </div>
              )}
            </div>

            {/* description */}
            {variant === "routine" && (
              <div className="">
                <p className="text-slate-600 text-sm w-full overflow-auto">
                  {new Date(`${task.deadline}T${task.timeToDo}`).toLocaleTimeString()}
                </p>
              </div>
            )}
            {variant === "default" && (
              <div>
                <p className="text-muted-foreground text-sm w-full overflow-auto">
                  {(task.description ?? "").length > 100
                    ? task.description?.slice(0, 100) + "..."
                    : task.description}
                </p>
              </div>
            )}
          </div>

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
        {variant === "default" && (
          <div>
            <div
              className={cn(
                "w-full border-b-2 border-green-300 mb-2",
                task.status === "overdue" && "border-red-400"
              )}
            ></div>
            <div className="flex justify-between">
              <h3 className="text-slate-600 text-sm font-mono">
                {
                  //if task is today date, show today instead of date
                  task.deadline === new Date().toISOString().split("T")[0]
                    ? "Today"
                    : task.deadline
                }
              </h3>
              <h3 className="text-slate-600 text-sm font-mono">
              {new Date(`${task.deadline}T${task.timeToDo}`).toLocaleTimeString()}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
