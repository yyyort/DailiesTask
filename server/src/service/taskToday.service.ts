import { and, asc, eq, exists, lt, max, notExists, sql, } from "drizzle-orm";
import { db } from "../db/db";
import { taskTable, taskTodayTable } from "../db/schema";
import { TaskReturnType, TaskTodayReturnType, TaskTodayType } from "../model/task.model";
import { ApiError } from "../util/apiError";
import cron from "node-cron";


export const taskTodayGetService = async (userId: string): Promise<TaskTodayReturnType[]> => {
    try {
        const res = await db
            .select({
                id: taskTable.id,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline,
                order: taskTodayTable.order
            })
            .from(taskTodayTable)
            .where(eq(taskTodayTable.userId, userId))
            .innerJoin(taskTable, eq(taskTodayTable.taskId, taskTable.id))
            .orderBy(asc(taskTodayTable.order));

        //convert data to TaskReturnType
        const tasks: TaskTodayReturnType[] = res.map(task => {
            return {
                id: task.id,
                title: task.title,
                description: task.description ?? "",
                status: task.status,
                timeToDo: task.timeToDo,
                deadline: task.deadline,
                order: task.order
            }
        })

        return tasks;
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
};

/* 
    insert a newly created if it is today
*/
export const taskTodayCreateService = async (userId: string, task: TaskReturnType): Promise<TaskTodayType> => {
    try {
        const res: TaskTodayType = await db.transaction(async (tx) => {
            //find the max order
            const maxOrder = await tx
                .select({
                    order: max(taskTodayTable.order)
                })
                .from(taskTodayTable)
                .where(eq(taskTodayTable.userId, userId))
                .limit(1);

            const currentMaxOrder = maxOrder[0]?.order ?? 0;

            //insert task
            const res = await tx
                .insert(taskTodayTable)
                .values({
                    userId: userId,
                    taskId: task.id,
                    order: currentMaxOrder + 1000
                }).returning();

            return res[0];
        })

        return res;
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
};



//job for inserting today's task
export const taskTodaySetNewTask = async (): Promise<void> => {
    try {
        //get all tasks that are today's date and not in task_today_table
        /* const res = await db
            .select({
                id: taskTable.id,
                userId: taskTable.userId,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline
            })
            .from(taskTable)
            .where(
                and(
                    eq(taskTable.deadline, new Date().toLocaleDateString()), //today's date
                    //check if task is not in task_today_table
                    
                    sql`NOT EXISTS (SELECT FROM ${taskTodayTable} WHERE ${taskTodayTable.taskId} = ${taskTable.id})`,
                )
            )
 */
        const res = await db
            .select({
                id: taskTable.id,
                userId: taskTable.userId,
                title: taskTable.title,
                description: taskTable.description,
                status: taskTable.status,
                timeToDo: taskTable.timeToDo,
                deadline: taskTable.deadline
            })
            .from(taskTable)
            .where(
                and(
                    eq(taskTable.deadline, new Date().toLocaleDateString()), //today's date
                    notExists(
                        db
                            .select()
                            .from(taskTodayTable)
                            .where(eq(taskTable.id, taskTodayTable.taskId))
                            .limit(1)
                    )
                )
                //q: why do i get error missing from clause entry for table "task_table"?
                //a: i forgot to add from clause in notExists
                //q: how to fix it?
                //a: add from clause in notExists
            )

        console.log('taskTodaySetNewTask getting tasks today', res);

        //bulk insert
        if (res.length > 0) {
            const tasksToday = await db.transaction(async (tx) => {
                //find the max order for each user
                const usersMaxOrders = await tx
                    .select({
                        userId: taskTodayTable.userId,
                        maxOrder: max(taskTodayTable.order) ?? 0
                    })
                    .from(taskTodayTable)
                    .where(
                        exists(
                            db
                                .select()
                                .from(taskTable)
                                .where(
                                    and(
                                        eq(taskTable.deadline, new Date().toLocaleDateString()),
                                        eq(taskTable.id, taskTodayTable.taskId)
                                    )
                                )
                        )
                    )
                    .groupBy(taskTodayTable.userId);

                const usersOrderMap = new Map(
                    usersMaxOrders.map(order => [order.userId, order.maxOrder ?? 0])
                );

                //bulk insert tasks
                const tasks = await tx
                    .insert(taskTodayTable)
                    .values(
                        res.map((task, index) => {
                            const currentMaxOrder = usersOrderMap.get(task.userId) ?? 0;

                            return {
                                userId: task.userId,
                                taskId: task.id,
                                order: currentMaxOrder + 1000 * (index + 1)
                            }
                        })
                    ).returning();

                return tasks;
            })

            console.log('taskTodaySetNewTask inserted tasks today', tasksToday);
        }

    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
};

//job for deleting previous day's task
export const taskTodayCleanUp = async (): Promise<void> => {
    try {
        //delete all done tasks that are not today's date
        await db
            .delete(taskTodayTable)
            .where(
                and(
                    sql`EXISTS (
                    SELECT 1
                    FROM ${taskTable} 
                    WHERE ${taskTable.id} = ${taskTodayTable.taskId} 
                    AND ${taskTable.status} = 'done' 
                    AND ${taskTable.deadline} < ${new Date().toLocaleDateString()}
                    )`,
                )
            )

    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
};

//job for making the tasks that is past the deadline overdue
export const taskTodaySetOverdue = async (): Promise<void> => {
    try {
        //update all tasks that are past the deadline and not done
        await db
            .update(taskTable)
            .set({
                status: 'overdue'
            })
            .where(
                and(
                    eq(taskTable.status, 'todo'),
                    lt(taskTable.deadline, new Date().toLocaleDateString())
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

export const taskTodayCronService = async (): Promise<void> => {
    //every day at 00:00
    cron.schedule('0 0 * * *', async () => {
        try {
            await taskTodaySetOverdue();

            await taskTodayCleanUp();

            await taskTodaySetNewTask();
        } catch (error: unknown) {
            console.error((error as Error));
            if (error instanceof ApiError) {
                throw error;
            }

            throw new Error((error as Error).message);
        }
    });

};