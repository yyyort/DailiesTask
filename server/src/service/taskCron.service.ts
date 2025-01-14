import { and, eq, lt, } from "drizzle-orm";
import { db } from "../db/db";
import { routineTasksTable, taskTable, usersTable } from "../db/schema";
import { ApiError } from "../util/apiError";
import { TaskCreateType } from "../model/task.model";
import { taskCreateBulkService } from "./task.service";

//seconds minutes hours day month year
/* export const taskTodayCronService = cron.schedule('0 2 0 * * * ', async () => {
    try {
        //setting overdue tasks
        await taskTodaySetOverdue();

        console.log('taskTodayCronService done');
    } catch (error: unknown) {
        console.error((error as Error));
    }
},
    {
        scheduled: true,
        timezone: 'Asia/Manila'
    }
); */

//job for making the tasks that is past the deadline overdue
export const taskTodaySetOverdue = async (userId: string): Promise<void> => {
    try {
        //update all tasks that are past the deadline
        await db
            .update(taskTable)
            .set({
                status: 'overdue'
            })
            .where(
                and(
                    eq(taskTable.userId, userId),
                    eq(taskTable.status, 'todo'),
                    lt(taskTable.deadline, new Date().toISOString().split('T')[0])
                ),
            )
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
};

//job for recycling routine tasks
export const taskTodayRecycleRoutine = async (userId: string): Promise<void> => {
    try {
        await db.transaction(async (trx) => {
            const tasksFromRoutine = await trx
                .select({
                    id: routineTasksTable.id,
                    title: routineTasksTable.title,
                    description: routineTasksTable.description,
                    timeToDo: routineTasksTable.timeToDo,
                })
                .from(routineTasksTable)
                .where(
                    and(
                        eq(routineTasksTable.userId, userId),
                    )
                )

            console.log('recycle task tasksFromRoutine', tasksFromRoutine);

            if (tasksFromRoutine.length >= 1) {
                //preprocess the data
                const tasksToBeRecycled: TaskCreateType[] = tasksFromRoutine.map(task => {
                    return {
                        title: task.title,
                        description: task.description ?? '',
                        status: 'todo',
                        timeToDo: task.timeToDo,
                        deadline: new Date().toISOString().split('T')[0],
                        routineTaskId: task.id
                    }
                });


                console.log('recycle task tasksToBeRecycled', tasksToBeRecycled);

                //insert the data
                await taskCreateBulkService(userId, tasksToBeRecycled);
            }
        });


    } catch (error) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }

};

//daily jobs for each user logged in
export const dailyJobs = async (userId: string): Promise<void> => {
    try {
        //check if user is logged in today
        const isLoggedToday = await db
            .select({
                lastLogin: usersTable.lastLogin
            })
            .from(usersTable)
            .where(
                eq(usersTable.id, userId)
            ).limit(1)

        //do nothing if user is logged in today and has logged in before
        if (new Date().toISOString().split('T')[0] > isLoggedToday[0].lastLogin) {
            console.log('doing daily jobs');

            //set overdue tasks
            await taskTodaySetOverdue(userId);

            //recyble routine tasks
            await taskTodayRecycleRoutine(userId);

            //set user as logged in today
            await db
                .update(usersTable)
                .set({
                    lastLogin: new Date().toISOString().split('T')[0]
                })
                .where(
                    eq(usersTable.id, userId)
                )
        } else {
            return;
        }

    } catch (error: unknown) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }

};