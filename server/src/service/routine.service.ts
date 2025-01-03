import { and, eq, exists, inArray } from "drizzle-orm";
import { db } from "../db/db";
import { routineTable, routineTasksTable, taskTable, taskTodayTable } from "../db/schema";
import { RoutineCreateType, RoutineReturnType, RoutineTaskReturnType, RoutineUpdateType } from "../model/routine.model";
import { TaskCreateType } from "../model/task.model";
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

        const routine: RoutineReturnType = await db.transaction(async (trx) => {
            //create routine
            const resRoutine = await trx
                .insert(routineTable)
                .values(routineData)
                .returning({
                    id: routineTable.id
                });

            //pre process routine tasks
            const routineTaskTobeCreated = data.tasks?.map(task => {
                return {
                    userId: userId,
                    routineId: resRoutine[0].id,
                    title: task.title,
                    description: task.description ?? "",
                    status: task.status,
                    timeToDo: task.timeToDo,
                    deadline: task.deadline
                }
            })

            if (routineTaskTobeCreated) {
                //create routine tasks
                const resRoutineTasks = await trx
                    .insert(routineTasksTable)
                    .values(
                        routineTaskTobeCreated
                    )
                    .returning({
                        id: routineTasksTable.id,
                        title: routineTasksTable.title,
                        description: routineTasksTable.description ?? "",
                        status: routineTasksTable.status,
                        timeToDo: routineTasksTable.timeToDo,
                        deadline: routineTasksTable.deadline,
                        routineId: routineTasksTable.routineId
                    });

                //post process tasks
                const tasksTobeCreated: TaskCreateType[] = resRoutineTasks.map(task => {
                    return {
                        routineTaskId: task.id,
                        title: task.title,
                        description: task.description ?? "",
                        status: task.status,
                        timeToDo: task.timeToDo,
                        deadline: task.deadline
                    }
                })

                //create tasks
                Promise.all(tasksTobeCreated.map(async task => {
                    console.log("task find me calling taskCreateService", task);
                    await taskCreateService(userId, task);
                }))

                return {
                    id: resRoutine[0].id,
                    title: data.title,
                    description: data.description,
                    tasks: resRoutineTasks.map(task => {
                        return {
                            id: task.id,
                            routineId: task.routineId,
                            title: task.title,
                            description: task.description ?? "",
                            status: task.status,
                            timeToDo: task.timeToDo,
                            deadline: task.deadline
                        }
                    })
                }
            } else {
                return {
                    id: resRoutine[0].id,
                    title: data.title,
                    description: data.description,
                    tasks: []
                }
            }

        });

        return routine;

    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}

/* 
    get all routines of a user
*/
export async function routineGetAllService(userId: string, filters?: string[]): Promise<RoutineReturnType[]> {
    try {
        console.log("filters in routine", filters);

        const resRoutines = await db
            .select({
                id: routineTable.id,
                title: routineTable.title,
                description: routineTable.description,
            })
            .from(routineTable)
            .where(
                filters ? and(
                    eq(routineTable.userId, userId),
                    inArray(routineTable.title, filters)
                ) : eq(routineTable.userId, userId)
            )

        //post processing
        /* 
            patch: get tasks from routineTasksTable instead of taskTable
        */
        const routines: RoutineReturnType[] = await Promise.all(resRoutines.map(async routine => {

            const resTasks: RoutineTaskReturnType[] = await db.transaction(
                async trx => {
                    const tasks = await trx
                        .select(
                            {
                                id: routineTasksTable.id,
                                routineId: routineTasksTable.routineId,
                                title: routineTasksTable.title,
                                description: routineTasksTable.description,
                                status: routineTasksTable.status,
                                timeToDo: routineTasksTable.timeToDo,
                                deadline: routineTasksTable.deadline
                            }
                        )
                        .from(routineTasksTable)
                        .where(
                            and(
                                eq(routineTasksTable.userId, userId),
                                eq(routineTasksTable.routineId, routine.id)
                            )
                        )

                    //get tasks status
                    const tasksId = await trx
                        .select({
                            taskId: taskTodayTable.taskId
                        })
                        .from(taskTodayTable)
                        .where(
                            and(
                                exists(
                                    db
                                        .select({
                                            id: taskTable.id
                                        })
                                        .from(taskTable)
                                        .where(
                                            and(
                                                eq(taskTable.userId, userId),
                                                inArray(taskTable.routineTaskId, tasks.map(task => task.id))
                                            )
                                        )
                                )
                            )
                        )

                    const taskStatus = await trx
                        .select({
                            id: taskTable.id,
                            status: taskTable.status,
                            routineTaskId: taskTable.routineTaskId
                        })
                        .from(taskTable)
                        .where(
                            and(
                                eq(taskTable.userId, userId),
                                inArray(taskTable.id, tasksId.map(task => task.taskId))
                            )
                        )

                    //map status to tasks
                    const finalTasks = tasks.map(task => {
                        const status = taskStatus.find(status => status.routineTaskId === task.id);

                        return {
                            id: task.id,
                            routineId: task.routineId,
                            title: task.title,
                            description: task.description ?? "",
                            status: status ? status.status : "todo",
                            timeToDo: task.timeToDo,
                            deadline: task.deadline
                        }
                    });

                    return finalTasks;
                }
            )

            return {
                id: routine.id,
                title: routine.title,
                description: routine.description ?? "",
                tasks: resTasks
            }
        }))

        return routines;

    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}

/* 
    get all routines of a user, only the id and title
*/
export async function routineGetAllHeaders(userId: string): Promise<{ id: string, title: string }[]> {
    try {
        const resRoutines = await db
            .select({
                id: routineTable.id,
                title: routineTable.title,
            })
            .from(routineTable)
            .where(eq(routineTable.userId, userId))

        return resRoutines;

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

        /* 
            patch: get tasks from RoutineTasksTable instead of taskTable
        */

        const routine: RoutineReturnType = await db.transaction(
            async (trx) => {
                //tasks
                const tasks = await trx
                    .select({
                        id: routineTasksTable.id,
                        routineId: routineTasksTable.routineId,
                        title: routineTasksTable.title,
                        description: routineTasksTable.description,
                        status: routineTasksTable.status,
                        timeToDo: routineTasksTable.timeToDo,
                        deadline: routineTasksTable.deadline
                    })
                    .from(routineTasksTable)
                    .where(
                        and(
                            eq(routineTasksTable.userId, userId),
                            eq(routineTasksTable.routineId, id)
                        )
                    )

                const tasksId = await trx
                    .select({
                        taskId: taskTodayTable.taskId
                    })
                    .from(taskTodayTable)
                    .where(
                        and(
                            exists(
                                db
                                    .select({
                                        id: taskTable.id
                                    })
                                    .from(taskTable)
                                    .where(
                                        and(
                                            eq(taskTable.userId, userId),
                                            inArray(taskTable.routineTaskId, tasks.map(task => task.id))
                                        )
                                    )
                            )
                        )
                    )


                const taskStatus = await trx
                    .select({
                        id: taskTable.id,
                        status: taskTable.status,
                        routineTaskId: taskTable.routineTaskId
                    })
                    .from(taskTable)
                    .where(
                        and(
                            eq(taskTable.userId, userId),
                            inArray(taskTable.id, tasksId.map(task => task.taskId))
                        )
                    )

                //map status to tasks
                const finalTasks: RoutineTaskReturnType[] = tasks.map(task => {
                    const status = taskStatus.find(status => status.routineTaskId === task.id);

                    return {
                        id: task.id,
                        routineId: task.routineId,
                        title: task.title,
                        description: task.description ?? "",
                        status: status ? status.status : "todo",
                        timeToDo: task.timeToDo,
                        deadline: task.deadline
                    }
                });


                //routine
                const routine = await trx
                    .select({
                        id: routineTable.id,
                        title: routineTable.title,
                        description: routineTable.description
                    })
                    .from(routineTable)
                    .where(
                        and(
                            eq(routineTable.userId, userId),
                            eq(routineTable.id, id)
                        )
                    )

                return {
                    id: routine[0].id,
                    title: routine[0].title,
                    description: routine[0].description ?? "",
                    tasks: finalTasks
                }
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
export async function routineUpdateService(userId: string, routineId: string, data: RoutineUpdateType): Promise<RoutineReturnType> {
    try {
        const routineData = {
            title: data.title,
            description: data.description
        }

        const routine = await db.transaction(async (trx) => {

            if (data.tasks) {
                //updating tasks
                const updatingTasks = data.tasks.filter(task => task.id !== undefined && task.id !== null);

                if (updatingTasks.length > 0) {
                    console.log("updating tasks", updatingTasks);

                    const updatingTasksData = updatingTasks.map(task => {
                        return {
                            id: task.id,
                            routineId: task.routineId,
                            title: task.title,
                            description: task.description ?? "",
                            status: task.status,
                            timeToDo: task.timeToDo,
                            deadline: task.deadline
                        }
                    })

                    //tasks
                    await Promise.all(updatingTasksData.map(async task => {
                        if (task.id && task.routineId) {
                            //update routine tasks
                            const resRoutineTask = await trx
                                .update(routineTasksTable)
                                .set({
                                    title: task.title,
                                    description: task.description,
                                    status: task.status,
                                    timeToDo: task.timeToDo,
                                    deadline: task.deadline
                                })
                                .where(
                                    and(
                                        eq(routineTasksTable.routineId, task.routineId),
                                        eq(routineTasksTable.userId, userId),
                                        eq(routineTasksTable.id, task.id)
                                    )
                                )
                                .returning({
                                    id: routineTasksTable.id,
                                    routineId: routineTasksTable.routineId,
                                    title: routineTasksTable.title,
                                    description: routineTasksTable.description,
                                    status: routineTasksTable.status,
                                    timeToDo: routineTasksTable.timeToDo,
                                    deadline: routineTasksTable.deadline
                                });

                            //get tasks, that are related to this routine task and in taskTodayTable
                            const selectedTask = await trx
                                .select({
                                    id: taskTable.id,
                                })
                                .from(taskTable)
                                .where(
                                    and(
                                        eq(taskTable.userId, userId),
                                        eq(taskTable.routineTaskId, task.id),
                                        exists(
                                            db.select({
                                                id: taskTodayTable.id
                                            })
                                                .from(taskTodayTable)
                                                .where(
                                                    and(
                                                        eq(taskTodayTable.userId, userId),
                                                        eq(taskTodayTable.taskId, taskTable.id)
                                                    )
                                                )
                                        )
                                    )
                                )

                            if (selectedTask.length > 0) {

                                //update tasks
                                await taskUpdateService(userId, selectedTask[0].id, {
                                    title: task.title,
                                    description: task.description,
                                    status: task.status,
                                    timeToDo: task.timeToDo,
                                    deadline: task.deadline,
                                    routineTaskId: resRoutineTask[0].id
                                });

                            }

                        }
                    }));
                }
            }

            //deleting tasks
            const getTasks = await trx
                .select({
                    id: routineTasksTable.id
                })
                .from(routineTasksTable)
                .where(
                    and(
                        eq(routineTasksTable.userId, userId),
                        eq(routineTasksTable.routineId, routineId)
                    )
                )

            //tasks that are in routineTasksTable but not in data.tasks
            const deletingTasks = getTasks.filter(task => {
                const found = data.tasks?.find(taskData => taskData.id === task.id);
                return found === undefined;
            });

            //delete tasks in taskTable that exist in routineTasksTable
            await trx
                .delete(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        inArray(taskTable.routineTaskId, deletingTasks.map(task => task.id)),
                        exists(
                            db.select({
                                id: taskTodayTable.id
                            })
                                .from(taskTodayTable)
                                .where(
                                    and(
                                        eq(taskTodayTable.userId, userId),
                                        eq(taskTodayTable.taskId, taskTable.id)
                                    )
                                )
                        )
                    )
                )

            //delete tasks
            await trx
                .delete(routineTasksTable)
                .where(
                    and(
                        eq(routineTasksTable.userId, userId),
                        eq(routineTasksTable.routineId, routineId),
                        inArray(routineTasksTable.id, deletingTasks.map(task => task.id))
                    )
                )



            //update routine
            const res = await trx
                .update(routineTable)
                .set(routineData)
                .where(
                    and(
                        eq(routineTable.userId, userId),
                        eq(routineTable.id, routineId)
                    )
                )
                .returning({
                    title: routineTable.title,
                    description: routineTable.description
                });

            const routine: RoutineReturnType = {
                id: routineId,
                title: res[0].title,
                description: res[0].description ?? "",
                tasks: []
            }

            return routine;
        });

        if (data.tasks) {
            //new tasks
            const newTasks = data.tasks.filter(task => task.id === undefined || task.id === null);
            console.log("new tasks", newTasks);

            if (newTasks.length > 0) {
                const newTasksData: TaskCreateType[] = newTasks.map(task => {
                    return {
                        userId: userId,
                        routineId: routineId,
                        title: task.title,
                        description: task.description ?? "",
                        status: task.status,
                        timeToDo: task.timeToDo,
                        deadline: task.deadline
                    }
                })

                console.log("newTasksData", newTasksData);

                //create tasks
                await Promise.all(newTasksData.map(async task => {

                    console.log("task find me", task);

                    //create routine tasks
                    const resRoutineTask = await db
                        .insert(routineTasksTable)
                        .values({
                            userId: userId,
                            routineId: routineId,
                            title: task.title,
                            description: task.description ?? "",
                            status: task.status,
                            timeToDo: task.timeToDo,
                            deadline: task.deadline
                        })
                        .returning({
                            id: routineTasksTable.id,
                            routineId: routineTasksTable.routineId,
                            title: routineTasksTable.title,
                            description: routineTasksTable.description,
                            status: routineTasksTable.status,
                            timeToDo: routineTasksTable.timeToDo,
                            deadline: routineTasksTable.deadline
                        });

                    if (resRoutineTask.length > 0) {
                        await taskCreateService(userId, {
                            routineTaskId: resRoutineTask[0].id,
                            title: resRoutineTask[0].title,
                            description: resRoutineTask[0].description ?? "",
                            status: resRoutineTask[0].status,
                            timeToDo: resRoutineTask[0].timeToDo,
                            deadline: resRoutineTask[0].deadline
                        });
                    }

                })
                );
            }
        }

        return routine;

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
        await db.transaction(async (trx) => {

            const tasks = await trx
                .select({
                    id: routineTasksTable.id
                })
                .from(routineTasksTable)
                .where(
                    and(
                        eq(routineTasksTable.userId, userId),
                        eq(routineTasksTable.routineId, id)
                    )
                )

            //delete tasks in taskTable that exist in routineTasksTable
            await trx
                .delete(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        inArray(taskTable.routineTaskId, tasks.map(task => task.id)),
                        exists(
                            db.select({
                                id: taskTodayTable.id
                            })
                                .from(taskTodayTable)
                                .where(
                                    and(
                                        eq(taskTodayTable.userId, userId),
                                        eq(taskTodayTable.taskId, taskTable.id)
                                    )
                                )
                        )
                    )
                )


            //delete whole routine
            await trx.delete(routineTable)
                .where(
                    and(
                        eq(routineTable.userId, userId),
                        eq(routineTable.id, id)
                    )
                )
                .returning({
                    id: routineTable.id
                });

        });
    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}