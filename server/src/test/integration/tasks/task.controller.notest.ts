import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from 'supertest';
import { UserCreateType } from "../../../model/user.model";
import { db } from "../../../db/db";
import { TaskCreateType, TaskReturnType } from "../../../model/task.model";
import { usersTable } from "../../../db/schema";

describe("task controller integration test", async () => {
    const req = request('http://localhost:4000'); //change to your server url

    //create a user
    const userTest: UserCreateType = {
        email: "task@example.com",
        password: "password",
        confirmPassword: "password"
    }

    const testTask: TaskCreateType = {
        title: "Test Task",
        description: "Test Description",
        status: "todo",
        timeToDo: "09:52:31",
        deadline: "2024-11-30"
    }

    //clean up
    beforeEach(async () => {
        await db.delete(usersTable)
    });

    beforeAll(async () => {
        await db.delete(usersTable)
    });

    afterAll(async () => {
        await db.delete(usersTable)
    })
    
    afterEach(async () => {
        await db.delete(usersTable)
    });


    // task create api
    describe("task create /api/task", async () => {
        it("should create a task and return the task", async () => {
            //create user
            const user = await req.post('/api/user/signup').send(userTest);

            const task = await req.post('/api/task').send(testTask).set('Authorization', `Bearer ${user.body.accessToken}`);

            expect(user.status).toBe(201);
            expect(user.body.accessToken).toBeTruthy();
            expect(task.status).toBe(201);
            expect(task.body.task).toMatchObject<TaskReturnType>({
                id: expect.any(Number),
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: testTask.timeToDo,
                deadline: testTask.deadline,
            });
        });
    });
});