import { and, asc, eq, exists, inArray, isNotNull, lt, max, notExists, } from "drizzle-orm";
import { db } from "../db/db";
import { taskTable, taskTodayTable } from "../db/schema";
import { TaskReturnType, TaskStatusType, TaskTodayReturnType, TaskTodayType } from "../model/task.model";
import { ApiError } from "../util/apiError";
import cron from "node-cron";
import { contributionCreateService } from "./contribution.service";


export const taskTodayGetService = async (userId: string, filter?: TaskStatusType[]): Promise<TaskTodayReturnType[]> => {
    try {
        if (filter) {
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
                .where(
                    and(
                        eq(taskTodayTable.userId, userId),
                        filter ? inArray(taskTable.status, filter) : inArray(taskTable.status, ['todo', 'done', 'overdue']
                        ))
                )
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
        }

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

//job for making the tasks that is past the deadline overdue
export const taskTodaySetOverdue = async (): Promise<void> => {
    try {
        //update all tasks that are past the deadline
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

//job for recyling the tasks that are in routine
export const taskTodayRecycleRoutine = async (): Promise<void> => {
    try {

        /* 
            patch: instead of setting the status to todo
            create a new tasks for today
        */
        await db.transaction(async (tx) => {

            //get all todays tasks id
            const tasksTodayIds = await tx
                .select({
                    taskId: taskTodayTable.taskId
                })
                .from(taskTodayTable);

            //get all tasks that are in routine in tasksTodayIds
            const tasks = await tx
                .select({
                    id: taskTable.id,
                    userId: taskTable.userId,
                    routineId: taskTable.routineId,
                    title: taskTable.title,
                    description: taskTable.description,
                    status: taskTable.status,
                    timeToDo: taskTable.timeToDo,
                    deadline: taskTable.deadline
                })
                .from(taskTable)
                .where(
                    and(
                        isNotNull(taskTable.routineId),
                        inArray(taskTable.id, tasksTodayIds.map(task => task.taskId))
                    )
                )

            //post process tasks
            const newTasks = tasks.map(task => {
                return {
                    userId: task.userId,
                    title: task.title,
                    description: task.description ?? "",
                    status: 'todo' as 'todo' | 'done' | 'overdue',
                    timeToDo: task.timeToDo,
                    deadline: new Date().toLocaleDateString(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    routineId: task.routineId
                }
            })

            //insert copied tasks with today's date
            const newRoutineTasks = await tx
                .insert(taskTable)
                .values(
                    newTasks
                )
                .returning(
                    {
                        userId: taskTable.userId,
                        id: taskTable.id,
                        title: taskTable.title,
                        description: taskTable.description,
                        status: taskTable.status,
                        timeToDo: taskTable.timeToDo,
                        deadline: taskTable.deadline
                    }
                );

            console.log('taskTodayRecycleRoutine newRoutineTasks', newRoutineTasks);
        });


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
        //remove all tasks that has deadline of yesterday or before, and have status of done
        await db.transaction(async (tx) => {
            //get all tasks that are yesterday's date and not in task_today_table
            const res = await tx
                .select({
                    id: taskTodayTable.id
                })
                .from(taskTodayTable)
                .where(
                    and(
                        lt(taskTable.deadline, new Date().toLocaleDateString()), //yesterday's date
                        eq(taskTable.status, 'done'),
                    )
                )
                .innerJoin(taskTable, eq(taskTodayTable.taskId, taskTable.id));

            console.log('taskTodayCleanUp getting tasks yesterday', res);

            //bulk delete
            if (res.length > 0) {
                await tx
                    .delete(taskTodayTable)
                    .where(inArray(taskTodayTable.id, res.map(task => task.id)));
            }
        })

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

//seconds minutes hours day month year
export const taskTodayCronService = cron.schedule('0 13 17 * * * ', async () => {
    try {
        //setting overdue tasks
        await taskTodaySetOverdue();

        //recycle routine tasks
        await taskTodayRecycleRoutine();

        //set users contributions
        await contributionCreateService();

        //clean up previous day's task
        await taskTodayCleanUp();

        //insert new tasks for today
        await taskTodaySetNewTask();

        console.log('taskTodayCronService done');
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
},
    {
        scheduled: true,
        timezone: 'Asia/Manila'
    }
);

