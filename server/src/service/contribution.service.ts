import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { contributionTable } from "../db/schema";
import { ContributionReturnType } from "../model/contribution.model";


/* get */
export async function contributionGetService(userId: string): Promise<ContributionReturnType[]> {
    try {
        const res = await db.select({
            id: contributionTable.id,
            tasksDone: contributionTable.tasksDone,
            tasksMissed: contributionTable.tasksMissed,
            date: contributionTable.date,
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
                    date: curr.date
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

/* update when task is updated*/
export async function contributionUpdateForTaskService(
    userId: string,
    date: Date,
    action: "done" | "delete" | "undo"
): Promise<void> {
    try {
        //check if there is a contribution for the date
        const res = await db
            .select({
                id: contributionTable.id,
                tasksDone: contributionTable.tasksDone,
                tasksMissed: contributionTable.tasksMissed,
                date: contributionTable.date,
            })
            .from(contributionTable)
            .where(
                and(
                    eq(contributionTable.userId, userId),
                    eq(contributionTable.date, new Date(date).toISOString().split('T')[0])
                )
            )
            .limit(1);

        console.log('date', date);
        console.log('contributionUpdateForTaskService', res);
        console.log('res length', res.length);

        //if there is no contribution for the date create one
        if (res.length <= 0 && action === "done") {
            console.log('create new contribution');

            await db.transaction(async (trx) => {
                const insertedContri = await trx
                    .insert(contributionTable)
                    .values({
                        userId: userId,
                        tasksDone: 0,
                        tasksMissed: 0,
                        date: new Date(date).toISOString().split('T')[0]
                    })
                    .returning({
                        id: contributionTable.id,
                        date: contributionTable.date
                    })

                await trx
                    .update(contributionTable)
                    .set({
                        tasksDone: 1
                    })
                    .where(
                        and(
                            eq(contributionTable.userId, userId),
                            eq(contributionTable.date, insertedContri[0].date)
                        )
                    )
            })
        } else if (res.length >= 1 && res) {
            console.log('update contribution');

            if (action === "done") {
                await db
                    .update(contributionTable)
                    .set({
                        tasksDone: res[0].tasksDone + 1
                    })
                    .where(
                        and(
                            eq(contributionTable.userId, userId),
                            eq(contributionTable.date, res[0].date)
                        )
                    )
            } else if (action === "delete" || action === "undo") {
                await db
                    .update(contributionTable)
                    .set({
                        tasksDone: res[0].tasksDone - 1
                    })
                    .where(
                        and(
                            eq(contributionTable.userId, userId),
                            eq(contributionTable.date, res[0].date)
                        )
                    )
            }
        }


    } catch (error) {
        console.error((error as Error));
        throw new Error((error as Error).message);
    }
}
