import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { UserCreateType } from "../../../model/user.model";
import { userCreateService } from "../../../service/user.service";
import { db } from "../../../db/db";
import { usersTable } from "../../../db/schema";
import { taskCreateService, taskDeleteService, taskGetAllService, taskGetService, taskUpdateService } from "../../../service/task.service";
import { TaskCreateType, TaskReturnType } from "../../../model/task.model";


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
        timeToDo: "09:52:31",
        deadline: "2024-11-30"
    }


    //reset db before each test
    beforeEach(async () => {
        await db.delete(usersTable)
    })

    beforeAll(async () => {
        // delete user
        await db.delete(usersTable)
    })

    afterAll(async () => {
        // delete user
        await db.delete(usersTable)
    })

    afterEach(async () => {
        // delete user
        await db.delete(usersTable)
    });

    // task create service
    describe("task create service", async () => {
        //normal case
        it("should create a task and return the task", async () => {
            //create user
            const user = await userCreateService(testUser);

            const task = await taskCreateService(user.id, testTask);

            expect(task).toMatchObject<TaskReturnType>({
                id: expect.any(Number),
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: testTask.timeToDo,
                deadline: testTask.deadline,
            });
        });
    });

    // task get service
    describe("task get service", async () => {
        //normal case
        it("should get a task and return the task", async () => {
            //create user
            const user = await userCreateService(testUser);

            const task = await taskCreateService(user.id, testTask);

            const taskGet = await taskGetService(user.id, task.id);

            expect(taskGet).toMatchObject<TaskReturnType>({
                id: task.id,
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: testTask.timeToDo,
                deadline: testTask.deadline,
            });
        });
    });

    // task get all service
    describe("task get all service", async () => {
        //normal case
        it("should get all tasks and return the tasks", async () => {
            //create user
            const user = await userCreateService(testUser);

            const task = await taskCreateService(user.id, testTask);

            const tasks = await taskGetAllService(user.id);

            expect(tasks).toEqual([{
                id: task.id,
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: testTask.timeToDo,
                deadline: testTask.deadline,
            }]);
        });
    });

    // task update service
    describe("task update service", async () => {
        //normal case
        it("should update a task and return the task", async () => {
            //create user
            const user = await userCreateService(testUser);

            const task = await taskCreateService(user.id, testTask);

            const taskUpdate = await taskUpdateService(user.id, task.id, {
                title: "Updated Title",
                description: "Updated Description",
                status: "done",
                timeToDo: "10:52:31",
                deadline: "2024-11-30"
            });

            expect(taskUpdate).toMatchObject<TaskReturnType>({
                id: task.id,
                title: "Updated Title",
                description: "Updated Description",
                status: "done",
                timeToDo: "10:52:31",
                deadline: "2024-11-30"
            });
        });
    });

    // task delete service
    describe("task delete service", async () => {
        //normal case
        it("should delete a task", async () => {
            //create user
            const user = await userCreateService(testUser);

            const task = await taskCreateService(user.id, testTask);

            await taskDeleteService(user.id, task.id);

            const tasks = await taskGetAllService(user.id);

            expect(tasks).toEqual([]);
        });
    });
});