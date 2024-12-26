import TaskContainer from "@/components/tasks/task-container";
import { TaskReturnType, TaskStatusType } from "@/model/task.model";
import { taskTodayGetService } from "@/service/taskService";

export default async function TaskMobile({ filter }: { filter: TaskStatusType[] }) {
  const tasks: TaskReturnType[] = await taskTodayGetService(filter);
  
  return (
    <>
      {tasks.map((task) => (
        <TaskContainer key={task.id} task={task} />
      ))}
    </>
  );
}
