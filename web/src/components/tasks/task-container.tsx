
import { TaskReturnType } from "@/model/task.model";
import { Checkbox } from "../ui/checkbox";
import { taskUpdateStatusService } from "@/service/taskService";

export default function TaskContainer(task: TaskReturnType) {
  {
    /* string date format to hh-mm Month-day */
  }
  
  return (
    <div className="bg-slate-100 rounded-md p-4 shadow-md border-b-2 border-r-2 border-slate-200 backdrop-blur-md backdrop-filter flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{task.title}</h1>
        <h3 className="text-slate-600 text-sm font-mono">{task.timeToDo}</h3>
      </div>
      <div>
        <Checkbox
          checked={task.status === "done"}
          className="size-7 fill-white bg-white border-slate-400 shadow-xl"
          onClick={async () => {
            "use server";

            await taskUpdateStatusService(task.id, task.status === "done" ? "todo" : "done");
          }}
        />
      </div>
    </div>
  );
}
