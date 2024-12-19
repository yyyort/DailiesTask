import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { routineTable, taskTable } from "../db/schema";
import { RoutineCreateType, RoutineReturnType, RoutineUpdateType } from "../model/routine.model";
import { TaskCreateType, TaskReturnType } from "../model/task.model";
import { taskCreateService, taskUpdateService } from "./task.service";


/* 
    create routine
*/
export async function routineCreateService(userId: string, data: RoutineCreateType): Promise<RoutineReturnType> {
    try {
        const routineData = {
            userId: userId,
            title: data.title,
            description: data.description
        }

        //create routine
        const resRoutine = await db.insert(routineTable)
            .values(routineData)
            .returning({
                id: routineTable.id
            });


        const tasksData: TaskCreateType[] = data.tasks?.map(task => {
            return {
                userId: userId,
                routineId: resRoutine[0].id,
                title: task.title,
                description: task.description ?? "",
                status: task.status,
                timeToDo: task.timeToDo,
                deadline: task.deadline
            }
        }) ?? [];

        //create tasks
        const resTasks: TaskReturnType[] = await Promise.all(tasksData.map(async task => {
            const res = await taskCreateService(userId, task);

            return res;
        }
        ))

        return {
            id: resRoutine[0].id,
            title: data.title,
            description: data.description,
            tasks: resTasks
        }

    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}

/* 
    get all routines of a user
*/
export async function routineGetAllService(userId: string): Promise<RoutineReturnType[]> {
    try {
        const resRoutines = await db
            .select({
                id: routineTable.id,
                title: routineTable.title,
                description: routineTable.description,
            })
            .from(routineTable)
            .where(eq(routineTable.userId, userId))



        //post processing
        const routines: RoutineReturnType[] = await Promise.all(resRoutines.map(async routine => {
            const resTasks = await db.select({
                id: taskTable.id,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline,
            }).from(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        eq(taskTable.routineId, routine.id)
                    )
                )

            const tasks: TaskReturnType[] = resTasks.map(task => {
                return {
                    id: task.id,
                    title: task.title,
                    description: task.description ?? "",
                    status: task.status,
                    timeToDo: task.timeToDo,
                    deadline: task.deadline
                }
            })

            return {
                id: routine.id,
                title: routine.title,
                description: routine.description ?? "",
                tasks: tasks
            }
        }))

        return routines;

    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}

/* 
    get a specific routine of a user
*/
export async function routineGetService(userId: string, id: string): Promise<RoutineReturnType> {
    try {
        const res = await db
            .select({
                id: routineTable.id,
                title: routineTable.title,
                description: routineTable.description,
                tasks: {
                    id: taskTable.id,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline
                }
            })
            .from(routineTable)
            .where(
                and(
                    eq(routineTable.userId, userId),
                    eq(routineTable.id, id)
                )
            )
            .innerJoin(taskTable,
                and(
                    eq(taskTable.userId, userId),
                    eq(taskTable.routineId, id)
                )
            )

        //post processing
        const routine: RoutineReturnType = res.reduce<RoutineReturnType>(
            (acc: RoutineReturnType, curr) => {
                if (!acc.id) {
                    acc.id = curr.id;
                    acc.title = curr.title;
                    acc.description = curr.description ?? "";
                    acc.tasks = []
                }

                acc.tasks?.push({
                    id: curr.tasks.id,
                    title: curr.tasks.title,
                    description: curr.tasks.description ?? "",
                    status: curr.tasks.status,
                    timeToDo: curr.tasks.timeToDo,
                    deadline: curr.tasks.deadline
                })

                return acc;
            },

            {
                id: "",
                title: "",
                description: "",
                tasks: []
            }
        )

        return routine;
    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}

/* 
    update routine
*/
export async function routineUpdateService(userId: string, id: string, data: RoutineUpdateType): Promise<RoutineUpdateType> {
    try {
        const routineData = {
            title: data.title,
            description: data.description
        }

        console.log("data", data);

        if (data.tasks) {
            //updating tasks
            const updatingTasks = data.tasks.filter(task => task.id !== undefined && task.id !== null);

            if (updatingTasks.length > 0) {
                console.log("updating tasks", updatingTasks);

                const updatingTasksData = updatingTasks.map(task => {
                    return {
                        id: task.id,
                        title: task.title,
                        description: task.description ?? "",
                        status: task.status,
                        timeToDo: task.timeToDo,
                        deadline: task.deadline
                    }
                })

                await Promise.all(updatingTasksData.map(async task => {

                    if (task.id) {
                        await taskUpdateService(userId, Number(task.id), {
                            title: task.title,
                            description: task.description,
                            status: task.status,
                            timeToDo: task.timeToDo,
                            deadline: task.deadline,
                            routineId: id
                        });
                    }
                })).catch(error => {
                    throw error;
                })
            }



            //new tasks
            const newTasks = data.tasks.filter(task => task.id === undefined || task.id === null);

            if (newTasks.length > 0) {
                const newTasksData: TaskCreateType[] = newTasks.map(task => {
                    return {
                        userId: userId,
                        routineId: id,
                        title: task.title,
                        description: task.description ?? "",
                        status: task.status,
                        timeToDo: task.timeToDo,
                        deadline: task.deadline
                    }
                })

                //create tasks
                await Promise.all(newTasksData.map(async task => {
                    await taskCreateService(userId, task);
                })
                ).catch(
                    error => {
                        throw error;
                    }
                )
            }
        }

        //update routine
        const res = await db.update(routineTable)
            .set(routineData)
            .where(
                and(
                    eq(routineTable.userId, userId),
                    eq(routineTable.id, id)
                )
            )
            .returning({
                title: routineTable.title,
                description: routineTable.description
            });

        return {
            title: res[0].title,
            description: res[0].description ?? ""
        }
    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}


/* 
    delete routine
*/
export async function routineDeleteService(userId: string, id: string): Promise<void> {
    try {
        await db.delete(routineTable)
            .where(
                and(
                    eq(routineTable.userId, userId),
                    eq(routineTable.id, id)
                )
            )
            .returning({
                id: routineTable.id
            });
    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}