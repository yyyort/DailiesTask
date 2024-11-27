import { afterAll, describe, expect, it } from "vitest";
import request from 'supertest';
import { UserCreateType, UserReturnType } from "../../../model/user.model";
import { db } from "../../../db/db";
import { taskTable, usersTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { TaskCreateType, TaskReturnType, TaskUpdateType } from "../../../model/task.model";
import { beforeEach } from "node:test";
import { randomInt } from "node:crypto";

describe("task controller integration test", async () => {
    const req = request('http://localhost:4000/api'); //change to your server url

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
        timeToDo: "2024-11-27T11:57:23.346Z",
        deadline: "2024-11-27T11:57:23.346Z"
    }

    const res = await req.post('/user/signup').send(userTest);

    const user: UserReturnType = res.body.user;
    const token = res.body.accessToken;

    //clean up
    beforeEach(async () => {
        await db.delete(taskTable).where(
            eq(taskTable.userId, user.id)
        )

    });

    afterAll(async () => {
        await db.delete(usersTable).where(
            eq(usersTable.id, user.id)
        )
        await db.delete(usersTable).where(
            eq(usersTable.email, "newTask@task.com")
        )
    })


    //test task get endpoint
    describe("task get endpoint", async () => {
        const res = await req.post('/task').send(testTask).set(
            //set the authorization header
            'Authorization', `Bearer ${token}`
        );

        //clean up
        afterAll(async () => {
            await db.delete(taskTable).where(
                eq(taskTable.userId, user.id)
            )
        });

        //normal case
        it("should return 200 and return the task", async () => {

            const task: TaskReturnType = res.body.task;

            //get the task
            const getRes = await req.get(`/task/${task.id}`).set(
                //set the authorization header
                `Authorization`, `Bearer ${token}`
            );

            const getTask: TaskReturnType = getRes.body.task;

            expect(getRes.statusCode).toBe(200);
            expect(getTask).toMatchObject({
                id: task.id,
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: new Date(testTask.timeToDo ?? '').toDateString(),
                deadline: new Date(testTask.deadline).toDateString()
            })
        });

        //error case: unauthorized
        it("should return 401 if no token is provided", async () => {
            const task: TaskReturnType = res.body.task;

            const getRes = await req.get(`/task/${task.id}`);

            expect(getRes.statusCode).toBe(401);
        });

        //error case: task does not exist
        it("should return 404 if task does not exist", async () => {
            const getRes = await req.get(`/task/${randomInt(8989, 89798)}`).set(
                //set the authorization header
                `Authorization`, `Bearer ${token}`
            );

            expect(getRes.statusCode).toBe(404);
        });

        //error case: task does not belong to user
        it("should return 404 if task does not belong to user", async () => {
            //new user
            const newUser: UserCreateType = {
                email: "newTask@task.com",
                password: "password",
                confirmPassword: "password"
            };

            //create new user
            const newRes = await req.post('/user/signup').send(newUser);

            const newToken = newRes.body.accessToken;
            //create a task
            const newTaskRes = await req.post('/task').send(testTask).set(
                //set the authorization header
                `Authorization`, `Bearer ${newToken}`);

            const newTask: TaskReturnType = newTaskRes.body.task;
            //get the task
            const getRes = await req.get(`/task/${newTask.id}`).set(
                //set the authorization header
                `Authorization`, `Bearer ${token}`
            );

            expect(getRes.statusCode).toBe(404);

            //clean up
            await db.delete(taskTable).where(
                eq(taskTable.userId, newRes.body.user.id)
            )

            await db.delete(usersTable).where(
                eq(usersTable.id, newRes.body.user.id)
            )
        });

        //test task get all endpoint
        it("should return 200 and return all tasks", async () => {
            //remove all tasks
            await db.delete(taskTable).where(
                eq(taskTable.userId, user.id)
            );

            //create a new task
            const newTaskRes = await req.post('/task').send(testTask).set(
                //set the authorization header
                `Authorization`, `Bearer ${token}`
            );
            const newTaskRes2 = await req.post('/task').send(testTask).set(
                //set the authorization header
                `Authorization`, `Bearer ${token}`
            );

            const newTask: TaskReturnType = newTaskRes.body.task;
            const newTask2: TaskReturnType = newTaskRes2.body.task;

            const res = await req.get('/task').set(
                //set the authorization header
                `Authorization`, `Bearer ${token}`
            );

            const tasks: TaskReturnType[] = res.body.tasks;

            expect(res.statusCode).toBe(200);
            expect(tasks).toHaveLength(2);
            expect(tasks).toMatchObject([
                {
                    id: newTask.id,
                    title: testTask.title,
                    description: testTask.description,
                    status: testTask.status,
                    timeToDo: new Date(testTask.timeToDo ?? '').toDateString(),
                    deadline: new Date(testTask.deadline).toDateString()
                },
                {
                    id: newTask2.id,
                    title: testTask.title,
                    description: testTask.description,
                    status: testTask.status,
                    timeToDo: new Date(testTask.timeToDo ?? '').toDateString(),
                    deadline: new Date(testTask.deadline).toDateString()
                }
            ]);
        });

        //error case: unauthorized
        it("should return 401 if no token is provided", async () => {
            const res = await req.get('/task');

            expect(res.statusCode).toBe(401);
        });

        //error case: no tasks
        it("should return empty object", async () => {
            //clean up
            await db.delete(taskTable).where(
                eq(taskTable.userId, user.id)
            );

            const res = await req.get('/task').set(
                //set the authorization header
                `Authorization`, `Bearer ${token}`
            );

            expect(res.body.tasks).toMatchObject([]);
        })
    });

    //test task create endpoint
    describe("task create endpoint", () => {
        //normal case
        it("should return 201, and return the task", async () => {
            const res = await req.post('/task').send(testTask).set(
                //set the authorization header
                'Authorization', `Bearer ${token}`
            );

            const task: TaskReturnType = res.body.task;

            expect(res.statusCode).toBe(201);
            expect(task).toMatchObject({
                id: task.id,
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: new Date(testTask.timeToDo ?? '').toDateString(),
                deadline: new Date(testTask.deadline).toDateString()
            })
        })

        //error case: unauthorized
        it("should return 401 if no token is provided", async () => {
            const res = await req.post('/task').send(testTask);

            expect(res.statusCode).toBe(401);
        })

        //error case: bad data - no title
        it("should return 400 if title is not provided", async () => {
            const res = await req.post('/task').send({
                description: testTask.description,
                status: testTask.status,
                timeToDo: testTask.timeToDo,
                deadline: testTask.deadline
            }).set(
                'Authorization', `Bearer ${token}`
            );

            expect(res.statusCode).toBe(400);
        })

        //error case: bad data - empty title
        it("should return 400 if title is empty", async () => {
            const res = await req.post('/task').send({
                ...testTask,
                title: ""
            }).set(
                'Authorization', `Bearer ${token}`
            );

            expect(res.statusCode).toBe(400);
        })

        //error case: bad data - no deadline
        it("should return 400 if deadline is not provided", async () => {
            const res = await req.post('/task').send({
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: testTask.timeToDo,
            }).set(
                'Authorization', `Bearer ${token}`
            );

            expect(res.statusCode).toBe(400);
        })

        //error case: bad data - empty deadline
        it("should return 400 if deadline is empty", async () => {
            const res = await req.post('/task').send({
                ...testTask,
                deadline: ""
            }).set(
                'Authorization', `Bearer ${token}`
            );

            expect(res.statusCode).toBe(400);
        })

        //error case: bad data - invalid status
        it("should return 400 if status is invalid", async () => {
            const res = await req.post('/task').send({
                ...testTask,
                status: "invalid"
            }).set(
                'Authorization', `Bearer ${token}`
            );

            expect(res.statusCode).toBe(400);
        })

        //error case: bad data - incomplete data
        it("should return 400 if data is incomplete", async () => {
            const res = await req.post('/task').send({
                title: testTask.title,
                description: testTask.description
            }).set(
                'Authorization', `Bearer ${token}`)
            expect(res.statusCode).toBe(400);
        }
        )
    })

    //test task update endpoint
    describe("task update endpoint", async () => {
        //create a task for update
        const testUpdateRes = await req.post('/task').send(testTask).set(
            //set the authorization header
            'Authorization', `Bearer ${token}`
        );

        const updateTestTask: TaskReturnType = testUpdateRes.body.task;

        const updateData: TaskUpdateType = {
            title: "Updated Task for test",
            description: "Updated Description",
            status: "done",
            timeToDo: "2024-11-27T11:57:23.346Z",
            deadline: "2024-11-27T11:57:23.346Z"
        }

        //normal case
        it("should return 200 and return the updated task", async () => {
            const testUpdateRes = await req.post('/task').send(testTask).set(
                //set the authorization header
                'Authorization', `Bearer ${token}`
            );

            const toUpdateTask: TaskReturnType = testUpdateRes.body.task;

            const updateRes = await req.put(`/task/${toUpdateTask.id}`).send(updateData).set(
                'Authorization', `Bearer ${token}`
            );

            const updatedTask: TaskReturnType = updateRes.body.task;

            expect(updateRes.statusCode).toBe(200);
            expect(updatedTask).toMatchObject({
                id: toUpdateTask.id,
                title: updateData.title,
                description: updateData.description,
                status: updateData.status,
                timeToDo: new Date(updateData.timeToDo ?? '').toDateString(),
                deadline: new Date(updateData.deadline ?? '').toDateString()
            });

            //clean up
            await db.delete(taskTable).where(
                eq(taskTable.userId, user.id)
            );
        });

        //error case: unauthorized
        it("should return 401 if no token is provided", async () => {
            const updateRes = await req.put(`/task/${updateTestTask.id}`).send(updateData);

            expect(updateRes.statusCode).toBe(401);
        });

        //error case: task does not exist
        it("should return 404 if task does not exist", async () => {
            const updateRes = await req.put(`/task/${randomInt(9000, 10000)}`).send(updateData).set(
                //set the authorization header
                'Authorization', `Bearer ${token}`
            );

            expect(updateRes.statusCode).toBe(404);
        });

        //error case: task does not belong to user
        it("should return 404 if task does not belong to user", async () => {
            //new user
            const newUser: UserCreateType = {
                email: "newTask@task.com",
                password: "password",
                confirmPassword: "password"
            };

            //create new user
            const newRes = await req.post('/user/signup').send(newUser);

            const newToken = newRes.body.accessToken;
            //create a task
            const newTaskRes = await req.post('/task').send(testTask).set(
                //set the authorization header
                `Authorization`, `Bearer ${newToken}`);

            const newTask: TaskReturnType = newTaskRes.body.task;

            //update the task
            const updateRes = await req.put(`/task/${newTask.id}`).send({
                title: "Updated Task",
                description: "Updated Description",
                status: "done",
                timeToDo: "2024-11-27T11:57:23.346Z",
                deadline: "2024-11-27T11:57:23.346Z"
            }).set(
                //set the authorization header
                'Authorization', `Bearer ${token}`
            );

            expect(updateRes.statusCode).toBe(404);

            //clean up
            await db.delete(taskTable).where(
                eq(taskTable.userId, newRes.body.user.id)
            )

            await db.delete(usersTable).where(
                eq(usersTable.id, newRes.body.user.id)
            )
        });

        //error case: bad data - invalid status
        it("should return 400 if status is invalid", async () => {

            const updateRes = await req.put(`/task/${updateTestTask.id}`).send({
                status: "invalid",
            }).set(
                //set the authorization header
                'Authorization', `Bearer ${token}`
            );

            expect(updateRes.statusCode).toBe(400);
        });

        //error case: bad data - no data
        it("should return 400 if no data is provided", async () => {

            const updateRes = await req.put(`/task/${updateTestTask.id}`).send({}).set(
                //set the authorization header
                'Authorization', `Bearer ${token}`
            );

            expect(updateRes.statusCode).toBe(400);
        });
    });

    //test task delete endpoint
    describe("task delete endpoint", async () => {

        //normal case
        it("should return 200 and return the deleted task", async () => {
            //create a task for delete
            const testDeleteRes = await req.post('/task').send(testTask).set(
                //set the authorization header
                'Authorization', `Bearer ${token}`
            );

            const deleteTestTask: TaskReturnType = testDeleteRes.body.task;


            const deleteRes = await req.delete(`/task/${deleteTestTask.id}`).set(
                //set the authorization header
                'Authorization', `Bearer ${token}`
            );

            const deletedTask: TaskReturnType = deleteRes.body.task;

            expect(deleteRes.statusCode).toBe(200);
            expect(deletedTask).toMatchObject({
                id: deleteTestTask.id,
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                timeToDo: new Date(testTask.timeToDo ?? '').toDateString(),
                deadline: new Date(testTask.deadline).toDateString()
            });
        });

        //error case: unauthorized
        it("should return 401 if no token is provided", async () => {
            const deleteRes = await req.delete(`/task/${randomInt(9000, 10000)}`);

            expect(deleteRes.statusCode).toBe(401);
        });

        //error case: task does not exist
        it("should return 404 if task does not exist", async () => {
            const deleteRes = await req.delete(`/task/${randomInt(9000, 10000)}`).set(
                //set the authorization header
                'Authorization', `Bearer ${token}`
            );

            expect(deleteRes.statusCode).toBe(404);
        });

        //error case: task does not belong to user
        it("should return 404 if task does not belong to user", async () => {
            //new user
            const newUser: UserCreateType = {
                email: "newTask@task.com",
                password: "password",
                confirmPassword: "password"
            };

            //create new user
            const newRes = await req.post('/user/signup').send(newUser);

            const newToken = newRes.body.accessToken;
            //create a task
            const newTaskRes = await req.post('/task').send(testTask).set(
                //set the authorization header
                `Authorization`, `Bearer ${newToken}`);

            const newTask: TaskReturnType = newTaskRes.body.task;

            //delete the task
            const deleteRes = await req.delete(`/task/${newTask.id}`).set(
                //set the authorization header
                `Authorization`, `Bearer ${token}`
            );

            expect(deleteRes.statusCode).toBe(404);

            //clean up
            await db.delete(taskTable).where(
                eq(taskTable.userId, newRes.body.user.id)
            )

            await db.delete(usersTable).where(
                eq(usersTable.id, newRes.body.user.id)
            )
        });
    })
});