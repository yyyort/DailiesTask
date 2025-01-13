import { and, eq, lt,} from "drizzle-orm";
import { db } from "../db/db";
import { taskTable } from "../db/schema";
import { ApiError } from "../util/apiError";
import cron from "node-cron";

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
                    lt(taskTable.deadline, new Date().toISOString())
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


//seconds minutes hours day month year
export const taskTodayCronService = cron.schedule('0 2 0 * * * ', async () => {
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
);

