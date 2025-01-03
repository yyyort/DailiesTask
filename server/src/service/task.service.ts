import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../db/db";
import { taskTable } from "../db/schema";
import { TaskCreateType, TaskReturnType, TaskStatusType, TaskUpdateType, } from "../model/task.model";
import { ApiError } from "../util/apiError";
import { taskConvertFromDb } from "../util/task.util";
import { taskTodayCreateService } from "./taskToday.service";
import { console } from "inspector";

//read
/* 
    get all tasks of a user
*/
export async function taskGetAllService(
    userId: string,
    date?: string,
    filter?: TaskStatusType[]
): Promise<TaskReturnType[]> {
    try {
        const res = await db
            .select({
                id: taskTable.id,
                routineTaskId: taskTable.routineTaskId,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline
            })
            .from(taskTable)
            .where(
                and(
                    eq(taskTable.userId, userId),
                    date ? eq(taskTable.deadline, new Date(date).toLocaleDateString()) : eq(taskTable.deadline, new Date().toLocaleDateString()),
                    filter ? inArray(taskTable.status, filter) : inArray(taskTable.status, ["todo", "done", "overdue"])
                )
            );

        //convert data to TaskReturnType
        const tasks: TaskReturnType[] = res.map(task => ({
            id: task.id,
            routineTaskId: task.routineTaskId,
            title: task.title,
            description: task.description ?? undefined,
            status: task.status,
            timeToDo: task.timeToDo,
            deadline: task.deadline
        }));

        return tasks;
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
): Promise<{ id: number, date: string }[]> {
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
        const tasks: { id: number, date: string }[] = res;

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
    id: number,
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
                deadline: taskTable.deadline
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

            const task = await db.insert(taskTable).values({
                userId: userId,
                routineTaskId: data.routineTaskId,
                title: data.title,
                description: data.description,
                status: data.status,
                timeToDo: data.timeToDo,
                deadline: data.deadline
            }).returning({
                id: taskTable.id,
                routineTaskId: taskTable.routineTaskId,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline
            })

            //convert data to TaskReturnType
            const taskData = await taskConvertFromDb(task[0]);

            if (taskData.deadline === new Date().toLocaleDateString()) {
                await taskTodayCreateService(userId, taskData);
            }

            console.log('taskData', taskData);

            return taskData;
        } else {
            console.log('routineTaskId findddd meee 1 aklsdjalsjdlkasjd', data.routineTaskId);


            const task = await db.insert(taskTable).values({
                userId: userId,
                title: data.title,
                description: data.description,
                status: data.status,
                timeToDo: data.timeToDo,
                deadline: data.deadline
            }).returning({
                id: taskTable.id,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline
            })

            //convert data to TaskReturnType
            const taskData: TaskReturnType = {
                id: task[0].id,
                title: task[0].title,
                description: task[0].description ?? "",
                status: task[0].status,
                timeToDo: new Date(task[0].timeToDo).toLocaleTimeString(),
                deadline: new Date(task[0].deadline).toLocaleDateString()
            };

            if (taskData.deadline === new Date().toLocaleDateString()) {
                await taskTodayCreateService(userId, taskData);
            }

            console.log('taskData', taskData);

            return taskData;
        }

        //q: why arent my console logs showing up?
        //a: you need to run the command "npm run dev" in the terminal to see the console logs
        //q: but it is running in a container
        //a: you need to run the command "docker logs <container id>" to see the console logs

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
    id: number,
    data: TaskUpdateType,
): Promise<TaskReturnType> {
    try {
        if (!id) {
            console.error("Id is required");
            throw new ApiError(400, "Id is required", {
                id: "Id is required"
            });
        }

        if (!userId) {
            console.error("User Id is required");
            throw new ApiError(400, "User Id is required", {
                userId: "User Id is required"
            });
        }

        if (data.status && data.status !== "todo" && data.status !== "done" && data.status !== "overdue") {
            console.error("Invalid status");
            throw new ApiError(400, "Invalid status", {
                status: "Invalid status"
            });
        }

        if (data.routineTaskId) {
            const task = await db.update(taskTable)
                .set({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    timeToDo: data.timeToDo,
                    deadline: data.deadline,
                    routineTaskId: data.routineTaskId
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
                    deadline: taskTable.deadline
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
                    deadline: taskTable.deadline
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
    id: number,
    status: TaskStatusType
): Promise<TaskReturnType> {
    try {
        if (!id) {
            console.error("Id is required");
            throw new ApiError(400, "Id is required", {});
        }

        if (status !== "todo" && status !== "done" && status !== "overdue") {
            console.error("Invalid status");
            throw new ApiError(400, "Invalid status", {});
        }

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
                deadline: taskTable.deadline
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
    id: number
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
                deadline: taskTable.deadline
            });

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