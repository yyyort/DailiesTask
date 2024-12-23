import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { contributionTable, taskTable, taskTodayTable, usersTable } from "../db/schema";
import { ContributionCreateType, ContributionReturnType } from "../model/contribution.model";


/* create */
export async function contributionCreateService(): Promise<void> {
    try {
        //get all users today tasks
        const usersTodayTasks = await db.select({
            userId: usersTable.id,
            taskId: taskTodayTable.taskId,
            status: taskTable.status,
        })
            .from(usersTable)
            .innerJoin(taskTodayTable, eq(usersTable.id, taskTodayTable.userId))
            .innerJoin(taskTable, eq(taskTodayTable.taskId, taskTable.id))

        //post processing
        const usersContributions = usersTodayTasks.reduce<ContributionCreateType[]>(
            (acc, curr) => {
                const userContribution = acc.find((contribution) => contribution.userId === curr.userId);

                if (userContribution) {
                    if (curr.status === "done") {
                        userContribution.tasksDone += 1;
                    } else if (curr.status === "overdue") {
                        userContribution.tasksMissed += 1;
                    }
                    userContribution.tasksTotal += 1;
                } else {
                    const newUserContribution: ContributionCreateType = {
                        userId: curr.userId,
                        tasksDone: curr.status === "done" ? 1 : 0,
                        tasksMissed: curr.status === "overdue" ? 1 : 0,
                        tasksTotal: 1,
                    }
                    acc.push(newUserContribution);
                }

                return acc;
            },
            []
        )

        console.log('contri', usersContributions);

        //insert contributions
        await db.insert(contributionTable).values(usersContributions);

    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}

/* get */
export async function contributionGetService(userId: string): Promise<ContributionReturnType[]> {
    try {
        const res = await db.select({
            id: contributionTable.id,
            tasksDone: contributionTable.tasksDone,
            tasksTotal: contributionTable.tasksTotal,
            tasksMissed: contributionTable.tasksMissed,
            createdAt: contributionTable.createdAt,
        })
            .from(contributionTable)
            .where(eq(contributionTable.userId, userId));

        //post processing
        const contribution: ContributionReturnType[] = res.reduce<ContributionReturnType[]>(
            (acc, curr) => {
                const newContribution: ContributionReturnType = {
                    id: curr.id,
                    tasksDone: curr.tasksDone,
                    tasksMissed: curr.tasksMissed,
                    tasksTotal: curr.tasksTotal,
                    createdAt: curr.createdAt,
                }
                acc.push(newContribution);
                return acc;
            },
            []
        )


        return contribution;
    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}