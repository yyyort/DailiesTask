import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { TaskReturnType } from '@/model/task.model'
import { getTasks } from '@/service/online/taskService'
import React, { useEffect } from 'react'

export default function Tasks() {
    const [tasks, setTasks] = React.useState<TaskReturnType[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const tasks = await getTasks();
            setTasks(tasks);
        }

        fetchTasks();
    }, []);

    console.log(tasks);

  return (
    <ThemedView>
        <ThemedText type="title">Tasks</ThemedText>

        {tasks.map((task) => (
            <ThemedText key={task.id}>{task.title}</ThemedText>
        ))}
    </ThemedView>
  )
}
