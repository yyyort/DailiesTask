import TaskContainer from '@/components/tasks/task-container';
import { TaskReturnType, TaskStatusType } from '@/model/task.model';
import { taskTodayGetService } from '@/service/taskService';
import React from 'react'

export default async function TasksLaptop(
    { filter }: { filter: TaskStatusType[] }
) {
      const tasks: TaskReturnType[] = await taskTodayGetService(filter);

    const todoTasks = tasks.filter((task) => task.status === "todo");
    const doneTasks = tasks.filter((task) => task.status === "done");
    const overdueTasks = tasks.filter((task) => task.status === "overdue");

  return (
    <div className='
        grid
        laptop:grid-cols-2
        desktop:grid-cols-3
        gap-x-8
        gap-y-4
    '>
        <div>
            <h2 className='
                text-2xl text-foreground font-semibold mb-3
            '>To do</h2>
            {todoTasks.map((task) => (
                <TaskContainer key={task.id} task={task} />
            ))}
        </div>
        <div>
            <h2 className='
                text-2xl text-foreground font-semibold mb-3
            '>Done</h2>
            {doneTasks.map((task) => (
                <TaskContainer key={task.id} task={task} />
            ))}
        </div>
        <div>
            <h2 className='
                text-2xl text-foreground font-semibold mb-3
            '>Overdue</h2>
            {overdueTasks.map((task) => (
                <TaskContainer key={task.id} task={task} />
            ))}
        </div>
    </div>
  )
}


