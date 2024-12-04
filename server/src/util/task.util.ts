import { TaskTableReturnType } from "../db/schema";
import { TaskReturnType } from "../model/task.model";

//convert from from db to model
export const taskConvertFromDb = async (task: TaskTableReturnType): Promise<TaskReturnType> => {
    return {
        id: task.id,
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        timeToDo: new Date(task.timeToDo).toLocaleTimeString(),
        deadline: new Date(task.deadline).toLocaleDateString()
    }
};

export const tasksConvertFromDb = async (tasks: TaskTableReturnType[]): Promise<TaskReturnType[]> => {
    return tasks.map(task => {
        return {
            id: task.id,
            title: task.title,
            description: task.description ?? "",
            status: task.status,
            timeToDo: new Date(task.timeToDo).toLocaleTimeString(),
            deadline: new Date(task.deadline).toLocaleDateString()
        }
    });
};