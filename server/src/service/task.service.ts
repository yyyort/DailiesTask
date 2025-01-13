import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../db/db";
import { taskTable } from "../db/schema";
import { TaskCreateType, TaskReturnType, TaskStatusType, TaskUpdateType, } from "../model/task.model";
import { ApiError } from "../util/apiError";
import { taskConvertFromDb, tasksConvertFromDb } from "../util/task.util";
import { contributionUpdateForTaskService } from "./contribution.service";

//read
/* 
    get all tasks of a user
*/
export async function taskGetAllService(
    { userId, date, filter }: { userId: string, date?: string, filter?: TaskStatusType[] }
): Promise<TaskReturnType[]> {
    try {
        console.log('date', date);
        console.log('filter', filter);
        console.log('userId', userId);

        if (filter && date) {
            const res = await db
                .select({
                    id: taskTable.id,
                    routineTaskId: taskTable.routineTaskId,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline,
                    order: taskTable.order
                })
                .from(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        inArray(taskTable.status, filter),
                        eq(taskTable.deadline, new Date(date).toISOString().split('T')[0]),
                    )
                )
                .orderBy(asc(taskTable.order));

            //convert data to TaskReturnType
            const tasks: TaskReturnType[] = res.map(task => ({
                id: task.id,
                routineTaskId: task.routineTaskId,
                title: task.title,
                description: task.description ?? '',
                status: task.status,
                timeToDo: task.timeToDo,
                deadline: task.deadline,
                order: task.order
            }));

            console.log('res in with filter and date', res, tasks);

            return tasks;
        } else if (filter && !date) {
            const res = await db
                .select({
                    id: taskTable.id,
                    routineTaskId: taskTable.routineTaskId,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline,
                    order: taskTable.order
                })
                .from(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        inArray(taskTable.status, filter),
                        eq(taskTable.deadline, new Date().toISOString().split('T')[0]),
                    )
                )
                .orderBy(asc(taskTable.order));

            //convert data to TaskReturnType
            const tasks: TaskReturnType[] = res.map(task => ({
                id: task.id,
                routineTaskId: task.routineTaskId,
                title: task.title,
                description: task.description ?? '',
                status: task.status,
                timeToDo: task.timeToDo,
                deadline: task.deadline,
                order: task.order
            }));

            console.log('res in with filter and no date', res, tasks);

            return tasks;
        } else if (!filter && date) {
            const res = await db
                .select({
                    id: taskTable.id,
                    routineTaskId: taskTable.routineTaskId,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline,
                    order: taskTable.order
                })
                .from(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        eq(taskTable.deadline, new Date(date).toISOString().split('T')[0]),
                    )
                )
                .orderBy(asc(taskTable.order));

            //convert data to TaskReturnType
            const tasks: TaskReturnType[] = res.map(task => ({
                id: task.id,
                routineTaskId: task.routineTaskId,
                title: task.title,
                description: task.description ?? '',
                status: task.status,
                timeToDo: task.timeToDo,
                deadline: task.deadline,
                order: task.order
            }));

            console.log('res in with no filter and date', res, tasks);

            return tasks;
        } else {
            const res = await db
                .select({
                    id: taskTable.id,
                    routineTaskId: taskTable.routineTaskId,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline,
                    order: taskTable.order
                })
                .from(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        eq(taskTable.deadline, new Date().toISOString().split('T')[0]),
                    )
                )
                .orderBy(asc(taskTable.order));

            //convert data to TaskReturnType
            const tasks: TaskReturnType[] = res.map(task => ({
                id: task.id,
                routineTaskId: task.routineTaskId,
                title: task.title,
                description: task.description ?? '',
                status: task.status,
                timeToDo: task.timeToDo,
                deadline: task.deadline,
                order: task.order
            }));

            console.log('res in with no filter and no date', res, tasks);

            return tasks;
        }


    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
};

export async function taskGetEverythingService(
    userId: string,
): Promise<{ id: string, date: string }[]> {
    try {
        const res = await db
            .select({
                id: taskTable.id,
                date: taskTable.deadline
            })
            .from(taskTable)
            .where(
                and(
                    isNull(taskTable.routineTaskId),
                    eq(taskTable.userId, userId)
                )
            );

        //convert data to TaskReturnType
        const tasks: { id: string, date: string }[] = res;

        return tasks;
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
};


//read
/* 
    get a specific task of a user
*/
export async function taskGetService(
    userId: string,
    id: string,
): Promise<TaskReturnType> {
    try {
        const res = await db
            .select({
                id: taskTable.id,
                routineTaskId: taskTable.routineTaskId,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline,
                order: taskTable.order
            })
            .from(taskTable)
            .where(
                and(
                    eq(taskTable.userId, userId),
                    eq(taskTable.id, id)
                )
            ).limit(1);

        //if task is not found
        if (res.length <= 0) {
            throw new ApiError(404, "No task found with that id", {});
        }

        //convert data to TaskReturnType
        const task = await taskConvertFromDb(res[0]);

        return task;
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
};

//create
export async function taskCreateService(
    userId: string,
    data: TaskCreateType,
): Promise<TaskReturnType> {
    try {
        if (!userId) {
            console.error("User Id is required");
            throw new ApiError(400, "User Id is required", {
                userId: "User Id is required"
            });
        }

        console.log('task in create service activatedd', data);
        if (data.routineTaskId && data.routineTaskId !== undefined && data.routineTaskId !== null) {
            console.log('routineTaskId findddd meee 2', data.routineTaskId);


            const task: TaskReturnType = await db.transaction(async (trx) => {
                //get the previos task order
                const order = await trx
                    .select({
                        order: taskTable.order
                    })
                    .from(taskTable)
                    .where(
                        and(
                            eq(taskTable.userId, userId),
                        )
                    )
                    .orderBy(desc(taskTable.order))
                    .limit(1);

                console.log('last order', order);
                const lastOrder = order.length > 0 ? order[0].order : 0;

                const taskRes = await db.insert(taskTable).values({
                    userId: userId,
                    routineTaskId: data.routineTaskId,
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    timeToDo: data.timeToDo,
                    deadline: data.deadline,
                    order: lastOrder + 10
                }).returning({
                    id: taskTable.id,
                    routineTaskId: taskTable.routineTaskId,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline,
                    order: taskTable.order
                })

                //convert data to TaskReturnType
                const taskData = await taskConvertFromDb(taskRes[0]);

                return taskData;
            });

            console.log('task', task);

            return task;
        } else {
            const task = await db.transaction(async (trx) => {
                const order = await trx
                    .select({
                        order: taskTable.order
                    })
                    .from(taskTable)
                    .where(
                        and(
                            eq(taskTable.userId, userId),
                        )
                    )
                    .orderBy(desc(taskTable.order))
                    .limit(1);

                const lastOrder = order.length > 0 ? order[0].order : 0;

                const taskRes = await db.insert(taskTable).values({
                    userId: userId,
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    timeToDo: data.timeToDo,
                    deadline: data.deadline,
                    order: lastOrder + 10
                }).returning({
                    id: taskTable.id,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline,
                    order: taskTable.order
                })

                //convert data to TaskReturnType
                const taskData: TaskReturnType = {
                    id: taskRes[0].id,
                    title: taskRes[0].title,
                    description: taskRes[0].description ?? "",
                    status: taskRes[0].status,
                    timeToDo: taskRes[0].timeToDo,
                    deadline: taskRes[0].deadline,
                    order: taskRes[0].order
                };

                return taskData;
            });


            return task;
        }

    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}

export async function taskCreateBulkService(
    userId: string,
    data: TaskCreateType[],
): Promise<TaskReturnType[]> {
    try {
        if (!userId) {
            console.error("User Id is required");
            throw new ApiError(400, "User Id is required", {
                userId: "User Id is required"
            });
        }

        const task: TaskReturnType[] = await db.transaction(async (trx) => {
            //get the previos task order
            const order = await trx
                .select({
                    order: taskTable.order
                })
                .from(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                    )
                )
                .orderBy(desc(taskTable.order))
                .limit(1);

            console.log('last order', order);

            const taskTobeInserted = data.map((task, index) => {
                return {
                    userId: userId,
                    routineTaskId: task.routineTaskId ?? null,
                    title: task.title,
                    description: task.description ?? "",
                    status: task.status,
                    timeToDo: task.timeToDo,
                    deadline: task.deadline,
                    order: order.length > 0 ? order[0].order + 10 * (index + 1) : 10 * (index + 1)
                }
            });

            const taskRes = await db
                .insert(taskTable)
                .values(
                    taskTobeInserted
                ).returning({
                    id: taskTable.id,
                    routineTaskId: taskTable.routineTaskId,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline,
                    order: taskTable.order
                })

            //convert taskRes to TaskReturnType
            const tasksData: TaskReturnType[] = await tasksConvertFromDb(taskRes);

            return tasksData;

        });

        console.log('task', task);

        return task;

    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }

}


//update
export async function taskUpdateService(
    userId: string,
    id: string,
    data: TaskUpdateType,
): Promise<TaskReturnType> {
    try {
        //if task is updated to done, update the contribution table as well
        await db.transaction(async (trx) => {
            //get the previous status
            const prevStatus = await trx
                .select({
                    status: taskTable.status,
                    createdAt: taskTable.createdAt
                })
                .from(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        eq(taskTable.id, id)
                    )
                );

            console.log('prevStatus', prevStatus);

            //if the status is updated to done
            if (data.status === "done" && prevStatus[0].status !== "done") {
                //update the contribution table
                console.log('action done');

                //check if there is a contribution for the day of the task
                await contributionUpdateForTaskService(userId, prevStatus[0].createdAt, "done");
            } else if (data.status === "todo" && prevStatus[0].status === "done") {
                //update the contribution table
                console.log('action undo');

                //check if there is a contribution for the day of the task
                await contributionUpdateForTaskService(userId, prevStatus[0].createdAt, "undo");
            }

        });

        if (data.routineTaskId) {
            const task = await db.update(taskTable)
                .set({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    timeToDo: data.timeToDo,
                    deadline: data.deadline,
                    routineTaskId: data.routineTaskId,
                    order: data.order
                })
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        eq(taskTable.id, id)
                    )
                )
                .returning({
                    id: taskTable.id,
                    routineTaskId: taskTable.routineTaskId,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline,
                    order: taskTable.order
                });

            if (task.length <= 0) {
                throw new ApiError(404, "No task found with that id", {});
            }

            //convert data to TaskReturnType
            const taskData = await taskConvertFromDb(task[0]);

            return taskData;
        } else {
            const task = await db.update(taskTable)
                .set({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    timeToDo: data.timeToDo,
                    deadline: data.deadline,
                    order: data.order
                })
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        eq(taskTable.id, id)
                    )
                )
                .returning({
                    id: taskTable.id,
                    routineTaskId: taskTable.routineTaskId,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline,
                    order: taskTable.order
                });

            if (task.length <= 0) {
                throw new ApiError(404, "No task found with that id", {});
            }

            //convert data to TaskReturnType
            const taskData = await taskConvertFromDb(task[0]);

            return taskData;
        }


    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw error;
    }
}

//task status update
export async function taskUpdateStatusService(
    userId: string,
    id: string,
    status: TaskStatusType
): Promise<TaskReturnType> {
    try {
        //if task is updated to done, update the contribution table as well
        await db.transaction(async (trx) => {
            //get the previous status
            const prevStatus = await trx
                .select({
                    status: taskTable.status,
                    createdAt: taskTable.createdAt
                })
                .from(taskTable)
                .where(
                    and(
                        eq(taskTable.userId, userId),
                        eq(taskTable.id, id)
                    )
                );

            console.log('prevStatus', prevStatus);

            //if the status is updated to done
            if (status === "done" && prevStatus[0].status !== "done") {
                //update the contribution table
                console.log('action done');

                //check if there is a contribution for the day of the task
                await contributionUpdateForTaskService(userId, prevStatus[0].createdAt, "done");
            } else if (status === "todo" && prevStatus[0].status === "done") {
                //update the contribution table
                console.log('action undo');

                //check if there is a contribution for the day of the task
                await contributionUpdateForTaskService(userId, prevStatus[0].createdAt, "undo");
            }

        });

        const task = await db.update(taskTable)
            .set({
                status: status
            })
            .where(
                and(
                    eq(taskTable.userId, userId),
                    eq(taskTable.id, id)
                )
            )
            .returning({
                id: taskTable.id,
                routineTaskId: taskTable.routineTaskId,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline,
                order: taskTable.order
            });

        if (task.length <= 0) {
            console.error("No task found with that id");
            throw new ApiError(404, "No task found with that id", {});
        }

        //convert data to TaskReturnType
        const taskData = await taskConvertFromDb(task[0]);

        return taskData;
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);

    }
}

//delete
export async function taskDeleteService(
    userId: string,
    id: string
): Promise<TaskReturnType> {
    try {
        const task = await db.delete(taskTable)
            .where(
                and(
                    eq(taskTable.userId, userId),
                    eq(taskTable.id, id)
                )
            )
            .returning({
                id: taskTable.id,
                routineTaskId: taskTable.routineTaskId,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline,
                order: taskTable.order,
                createdAt: taskTable.createdAt,
            });

        //update contribution table
        await contributionUpdateForTaskService(userId, task[0].createdAt, "delete");

        //if task is not found
        if (task.length <= 0) {
            throw new ApiError(404, "No task found with that id", {});
        }

        //convert data to TaskReturnType
        const taskData = await taskConvertFromDb(task[0]);

        return taskData;

    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);

    }
}