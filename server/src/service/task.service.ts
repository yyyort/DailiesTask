import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { taskTable } from "../db/schema";
import { TaskCreateType, TaskReturnType, TaskUpdateType, } from "../model/task.model";
import { ApiError } from "../util/apiError";
import { taskConvertFromDb, tasksConvertFromDb } from "../util/task.util";

//read
/* 
    get all tasks of a user
*/
export async function taskGetAllService(
    userId: string
): Promise<TaskReturnType[]> {
    try {
        const res = await db
            .select({
                id: taskTable.id,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline
            })
            .from(taskTable)
            .where(eq(taskTable.userId, userId));

        //convert data to TaskReturnType
        const tasks: TaskReturnType[] = await tasksConvertFromDb(res);

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
    id: number
): Promise<TaskReturnType> {
    try {
        const res = await db
            .select({
                id: taskTable.id,
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

        if (!data.title) {
            console.error("Title is required");
            throw new ApiError(400, "Title is required", {});
        }

        if (!data.deadline) {
            console.error("Deadline is required");
            throw new ApiError(400, "Deadline is required", {});
        }

        if (data.status !== "todo" && data.status !== "done" && data.status !== "overdue") {
            console.error("Invalid status");
            throw new ApiError(400, "Invalid status", {});
        }

        //convert TaskCreateType to values needed for insert
        const converted = {
            timeToDo: data.timeToDo ? new Date(data.timeToDo) : null,
            deadline: new Date(data.deadline)
        };

        const task = await db.insert(taskTable).values({
            userId: userId,
            title: data.title,
            description: data.description,
            status: data.status,
            timeToDo: converted.timeToDo,
            deadline: converted.deadline ?? undefined
        }).returning({
            id: taskTable.id,
            title: taskTable.title,
            description: taskTable.description,
            status: taskTable.status,
            timeToDo: taskTable.timeToDo,
            deadline: taskTable.deadline
        })

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

//update
export async function taskUpdateService(
    userId: string,
    id: number,
    data: TaskUpdateType,
): Promise<TaskReturnType> {
    try {
        if (!id) {
            console.error("Id is required");
            throw new ApiError(400, "Id is required", {});
        }

        if (!userId) {
            console.error("User Id is required");
            throw new ApiError(400, "User Id is required", {});
        }

        if (data.status && data.status !== "todo" && data.status !== "done" && data.status !== "overdue") {
            console.error("Invalid status");
            throw new ApiError(400, "Invalid status", {});
        }

        //convert date string to Date
        const converted = {
            timeToDo: data.timeToDo ? new Date(data.timeToDo) : undefined,
            deadline: data.deadline ? new Date(data.deadline) : undefined
        };

        const task = await db.update(taskTable)
            .set({
                title: data.title,
                description: data.description,
                status: data.status,
                timeToDo: converted.timeToDo,
                deadline: converted.deadline
            })
            .where(
                and(
                    eq(taskTable.userId, userId),
                    eq(taskTable.id, id)
                )
            )
            .returning({
                id: taskTable.id,
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
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw error;
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