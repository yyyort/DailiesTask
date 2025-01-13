import { TaskTableReturnType } from "../db/schema";
import { TaskReturnType } from "../model/task.model";

//convert from from db to model
export const taskConvertFromDb = async (task: TaskTableReturnType): Promise<TaskReturnType> => {
    return {
        id: task.id,
        routineTaskId: task.routineTaskId,
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        timeToDo: task.timeToDo,
        deadline: task.deadline,
        order: task.order
    }
};

export const tasksConvertFromDb = async (tasks: TaskTableReturnType[]): Promise<TaskReturnType[]> => {
    return tasks.map(task => {
        return {
            id: task.id,
            routineTaskId: task.routineTaskId,
            title: task.title,
            description: task.description ?? "",
            status: task.status,
            timeToDo: task.timeToDo,
            deadline: task.deadline,
            order: task.order
        }
    });
};