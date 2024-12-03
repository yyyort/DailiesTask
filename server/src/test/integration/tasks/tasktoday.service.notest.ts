import { afterAll, describe, expect, it } from "vitest";
import { TaskCreateType, TaskReturnType, TaskTodayReturnType } from "../../../model/task.model";
import { UserCreateType } from "../../../model/user.model";
import { userCreateService } from "../../../service/user.service";
import { taskCreateService } from "../../../service/task.service";
import { taskTodayCleanUp, taskTodayCreateService, taskTodayGetService, taskTodaySetNewTask, taskTodaySetOverdue } from "../../../service/taskToday.service";
import { db } from "../../../db/db";
import { taskTable, usersTable } from "../../../db/schema";
import { eq } from "drizzle-orm";

describe("TaskTodayService", async () => {
    // create mock user
    const userTest: UserCreateType = {
        email: "taskToday@gmail.com",
        password: "taskToday",
        confirmPassword: "taskToday"
    }

    // create a task
    const newTask: TaskCreateType = {
        title: "test task",
        description: "test description",
        status: "todo",
        timeToDo: new Date().toLocaleTimeString(), //get current time
        deadline: new Date().toLocaleDateString()
    }


    // sign up user
    const user = await userCreateService(userTest);

    //clean up
    afterAll(async () => {
        // delete user
        await db.delete(usersTable).where(
            eq(usersTable.email, userTest.email)
        );
    });

    // create task test
    describe("create task test", async () => {
        //clean up task
        afterAll(async () => {
            // delete task
            await db.delete(taskTable).where(
                eq(taskTable.userId, user.id)
            );
        });

        // create task
        const task = await taskCreateService(user.id, newTask);
        const task2 = await taskCreateService(user.id, newTask);

        const taskToday = await taskTodayCreateService(
            user.id,
            task
        );

        const taskToday2 = await taskTodayCreateService(
            user.id,
            task2
        );

        //normal insert case
        it("should be able to insert new task in taskTodayTable", async () => {
            // check if task is created
            expect(task).toBeDefined();
            expect(taskToday).toMatchObject({
                userId: user.id,
                taskId: task.id,
                order: 1000
            });

            expect(task2).toBeDefined();
            expect(taskToday2).toMatchObject({
                userId: user.id,
                taskId: task2.id,
                order: 2000
            });
        });

        //get today's task
        it("should be able to get today's task", async () => {
            const res: TaskTodayReturnType[] = await taskTodayGetService(user.id);

            expect(res).toBeDefined();
            expect(res).toHaveLength(2);
            res.map((task, index) => {
                expect(task).toMatchObject({
                    id: task.id,
                    title: "test task",
                    description: "test description",
                    status: "todo",
                    deadline: new Date().toLocaleDateString(),
                    order: 1000 * (index + 1)
                });
            });
        });

        // tasks today clean up
        it("should remove all the tasks that are not today", async () => {
            // create a task that has a deadline in the past
            const task3 = await taskCreateService(user.id, {
                title: "test task 3",
                description: "test description",
                status: "done",
                deadline: new Date("2021-01-01").toLocaleDateString()
            });

            const taskToday3 = await taskTodayCreateService(
                user.id,
                task3
            );

            // clean not today tasks and have status done
            await taskTodayCleanUp();

            // get today's task
            const res: TaskTodayReturnType[] = await taskTodayGetService(user.id);

            expect(taskToday3).toBeDefined();
            expect(res).toBeDefined();
            expect(res).toHaveLength(2);

            // check if task3 is removed
            expect(res).not.toContainEqual({
                id: task3.id,
                title: "test task 3",
                description: "test description",
                status: "todo",
                deadline: new Date("2021-01-01").toLocaleDateString(),
                order: 3000
            });
        });

        //should update status to overdue if deadline is past
        it("should update status to overdue if deadline is past", async () => {
            // create a task that has a deadline in the past
            const task4 = await taskCreateService(user.id, {
                title: "test task 4",
                description: "test description",
                status: "todo",
                deadline: "2021-01-01"
            });

            const task5 = await taskCreateService(user.id, {
                title: "test task 5",
                description: "test description",
                status: "todo",
                deadline: "2025-12-12"
            });

            // update first task to done
            await db
                .update(taskTable)
                .set({
                    status: "done"
                })
                .where(
                    eq(taskTable.id, task.id)
                );


            const taskToday4 = await taskTodayCreateService(
                user.id,
                task4
            );


            const taskToday5 = await taskTodayCreateService(
                user.id,
                task5
            );

            // set overdue tasks
            await taskTodaySetOverdue();

            // get today's task
            const res: TaskReturnType[] = await taskTodayGetService(user.id);

            expect(taskToday4).toBeDefined();
            expect(taskToday5).toBeDefined();
            expect(res).toBeDefined();
            expect(res).toHaveLength(4);

            expect(res[0]).toMatchObject({
                id: task.id,
                title: "test task",
                description: "test description",
                status: "done",
                deadline: new Date().toLocaleDateString(),
                order: 1000
            });

             expect(res[1]).toMatchObject({
                 id: task2.id,
                 title: "test task",
                 description: "test description",
                 status: "todo",
                 deadline: new Date().toLocaleDateString(),
                 order: 2000
             });

            expect(res[2]).toMatchObject({
                id: task4.id,
                title: "test task 4",
                description: "test description",
                status: "overdue",
                deadline: new Date("2021-01-01").toLocaleDateString()
            });

            expect(res[3]).toMatchObject({
                id: task5.id,
                title: "test task 5",
                description: "test description",
                status: "todo",
                deadline: new Date("2025-12-12").toLocaleDateString()
            });
        });
    });

    // test if task will be inserted in taskTodayTable
    describe("test setting new task in todays tasks", async () => {
        //clean up task
        it("should be able to insert new task in taskTodayTable", async () => {
            const task: TaskReturnType = await taskCreateService(user.id, newTask);
            const task2: TaskReturnType = await taskCreateService(user.id, newTask);
            const task3: TaskReturnType = await taskCreateService(user.id,
                {
                    title: "test task 3",
                    description: "test description",
                    status: "done",
                    deadline: new Date("2021-01-01").toLocaleDateString()
                }
            );
            const task4: TaskReturnType = await taskCreateService(user.id,
                {
                    title: "test task 4",
                    description: "test description",
                    status: "done",
                    deadline: new Date("2021-01-01").toLocaleDateString()
                }
            );

            await taskTodaySetNewTask();

            const res: TaskTodayReturnType[] = await taskTodayGetService(user.id);

            expect(task).toBeDefined();
            expect(task2).toBeDefined();
            expect(task3).toBeDefined();
            expect(task4).toBeDefined();
            expect(res).toBeDefined();
            expect(res).toHaveLength(2);
            res.map((task, index) => {
                expect(task).toMatchObject({
                    id: task.id,
                    title: "test task",
                    description: "test description",
                    status: "todo",
                    deadline: new Date().toLocaleDateString(),
                    order: 1000 * (index + 1)
                });
            });
        });
    });

    // test if task will be removed if deadline is past

    // test if task status will be updated to overdue if deadline is past

});