import TaskContainer from "@/components/tasks/task-container";
import { TaskReturnType } from "@/model/task.model";

export default async function TaskMobile({
  tasks,
}: {
  tasks: TaskReturnType[];
}) {
  return (
    <>
      {tasks.map((task) => (
        <TaskContainer key={task.id} task={task} />
      ))}
    </>
  );
}
