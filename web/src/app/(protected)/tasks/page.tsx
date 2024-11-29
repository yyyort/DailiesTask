import { taskGetService } from "@/service/taskService";

export default async function Tasks() {
  const tasks = await taskGetService();

  return (
    <div>
      <h1>Task page</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
