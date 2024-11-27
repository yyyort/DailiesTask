import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { UserCreateType, UserReturnType } from "../../../model/user.model";
import { userCreateService } from "../../../service/user.service";
import { db } from "../../../db/db";
import { taskTable, usersTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { taskCreateService, taskDeleteService, taskGetAllService, taskGetService, taskUpdateService } from "../../../service/task.service";
import { TaskCreateType, TaskReturnType } from "../../../model/task.model";
import { v4 as uuid } from "uuid";
import { randomInt } from "crypto";

describe("task service integration test", async () => {
    //create user
    const testUser: UserCreateType = {
        email: "example1@example.com",
        password: "password",
        confirmPassword: "password",
    }

    const testTask: TaskCreateType = {
        title: "Test Task",
        description: "Test Description",
        status: "todo",
        timeToDo: "2024-11-27T11:57:23.346Z",
        deadline: "2024-11-27T11:57:23.346Z"
    }

    const testUserData: UserReturnType = await userCreateService(testUser);

    //reset db before each test
    beforeEach(async () => {
        await db.delete(taskTable).where(
            eq(taskTable.userId, testUserData.id)
        )
    })

    afterAll(async () => {
        // delete user
        await db.delete(usersTable).where(
            eq(usersTable.id, testUserData.id)
        )
    })


    //test task create service
    describe("task create service", () => {
        //normal case
        it("should create a task and return the task", async () => {
            const task: TaskReturnType = await taskCreateService(
                testUserData.id,
                testTask
            )

            expect(task).toMatchObject<TaskReturnType>({
                id: task.id,
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: new Date(testTask.timeToDo ?? '').toDateString(),
                deadline: new Date(testTask.deadline).toDateString()
            })
        });

        //error case
        it("should throw an error if user does not exist", async () => {
            await expect(taskCreateService(
                uuid(),
                testTask
            )).rejects.toThrowError();
        });

        //bad data no title
        it("should throw an error if title is not provided", async () => {
            await expect(taskCreateService(
                testUserData.id,
                {
                    ...testTask,
                    title: ""
                }
            )).rejects.toThrowError();
        });
        //bad data no deadline
        it("should throw an error if deadline is not provided", async () => {
            await expect(taskCreateService(
                testUserData.id,
                {
                    ...testTask,
                    deadline: ""
                }
            )).rejects.toThrowError();
        });
    });
    //test task get service
    describe("task get service", () => {

        //normal case get a task
        it("should get a task", async () => {
            //create a task
            const task: TaskReturnType = await taskCreateService(
                testUserData.id,
                testTask
            );

            const result = await taskGetService(testUserData.id, task.id);

            expect(result).toMatchObject<TaskReturnType>({
                id: task.id,
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: new Date(testTask.timeToDo ?? '').toDateString(),
                deadline: new Date(testTask.deadline).toDateString()
            });
        });

        //normal case get all tasks
        it("should get all tasks", async () => {
            //create a task
            const task: TaskReturnType = await taskCreateService(
                testUserData.id,
                testTask
            );

            const result: TaskReturnType[] = await taskGetAllService(testUserData.id);

            expect(result).toMatchObject<TaskReturnType[]>([
                {
                    id: task.id,
                    title: testTask.title,
                    description: testTask.description,
                    status: testTask.status,
                    timeToDo: new Date(testTask.timeToDo ?? '').toDateString(),
                    deadline: new Date(testTask.deadline).toDateString()
                }
            ])
        });

        //error case get a task: no task
        it("should throw an error if task does not exist", async () => {
            await expect(taskGetService(
                testUserData.id,
                //random number
                randomInt(1000, 2000)
            )).rejects.toThrowError();
        });

        //error case get all tasks: no tasks
        it("should return empty array", async () => {
            await expect(taskGetAllService(
                testUserData.id
            )).resolves.toEqual([]);
        });

        //error case get a task: no user
        it("should throw an error if user does not exist", async () => {
            await expect(taskGetService(
                uuid(),
                1
            )).rejects.toThrowError();
        });
    })

    //test task update service
    describe("task update service", () => {
        //normal case
        it("should update a task and return the updated task", async () => {
            const task: TaskReturnType = await taskCreateService(
                testUserData.id,
                testTask
            );

            const updatedTask: TaskCreateType = {
                title: "Updated Task",
                description: "Updated Description",
                status: "done",
                timeToDo: "2024-11-27T11:57:23.346Z",
                deadline: "2024-11-27T11:57:23.346Z"
            }

            const result = await taskUpdateService(
                testUserData.id,
                task.id,
                updatedTask
            );

            expect(result).toMatchObject<TaskReturnType>({
                id: task.id,
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                timeToDo: new Date(updatedTask.timeToDo ?? '').toDateString(),
                deadline: new Date(updatedTask.deadline).toDateString()
            });
        });

        //error case: no task
        it("should throw an error if task does not exist", async () => {
            await expect(taskUpdateService(
                testUserData.id,
                randomInt(1000, 2000),
                testTask
            )).rejects.toThrowError();
        });

        //error case: no user
        it("should throw an error if user does not exist", async () => {
            await expect(taskUpdateService(
                uuid(),
                1,
                testTask
            )).rejects.toThrowError();
        });
    });

    //test task delete service
    describe("task delete service", () => {
        //normal case
        it("should delete the task and return the task", async () => {
            const task: TaskReturnType = await taskCreateService(
                testUserData.id,
                testTask
            );

            const result: TaskReturnType = await taskDeleteService(
                testUserData.id,
                task.id
            );

            expect(result).toMatchObject<TaskReturnType>({
                id: task.id,
                title: testTask.title,
                description: testTask.description,
                status: "todo",
                timeToDo: new Date(testTask.timeToDo ?? '').toDateString(),
                deadline: new Date(testTask.deadline).toDateString()
            });
        });

        //error case: no task
        it("should throw an error if task does not exist", async () => {
            await expect(taskDeleteService(
                testUserData.id,
                randomInt(1000, 2000)
            )).rejects.toThrowError();
        });

        //error case: no user
        it("should throw an error if user does not exist", async () => {
            await expect(taskDeleteService(
                uuid(),
                1
            )).rejects.toThrowError();
        });
    })
});