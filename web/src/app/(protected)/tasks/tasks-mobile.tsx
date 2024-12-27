import TaskContainer from "@/components/tasks/task-container";
import { TaskReturnType } from "@/model/task.model";
import { taskGetAllService, taskTodayGetService } from "@/service/tasks/taskService";


export default async function TaskMobile(
  {
    filter,
    dateFilter,
  }: {
    filter: string;
    dateFilter: string;
  }
) {
  const tasks: TaskReturnType[] = [];
  
  if (dateFilter === new Date().toLocaleDateString() || !dateFilter) {
      const res = await taskTodayGetService(filter);
  
      tasks.push(...res);
    } else if (dateFilter && dateFilter !== new Date().toLocaleDateString()) {
      const res = await taskGetAllService(dateFilter, filter);
  
      tasks.push(...res);
    }

  return (
    <>
      {tasks.map((task) => (
        <TaskContainer key={task.id} task={task} />
      ))}
    </>
  );
}
