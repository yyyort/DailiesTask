import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "../../../db/db";
import { usersTable } from "../../../db/schema";
import request from "supertest";
import { TaskCreateType, TaskStatusType } from "../../../model/task.model";
import { eq } from "drizzle-orm";

/* 
    router.get('/task/today', authValidator, taskTodayGetController);
    router.get('/task/everything', authValidator, taskGetEverythingController);
    
    router.get('/task/:id', authValidator, taskGetController);
    router.get('/task', authValidator, taskGetAllController);
    router.post('/task', authValidator, schemaValidator(TaskCreateSchema), taskCreateController);
    router.put('/task/:id', authValidator, schemaValidator(TaskUpdateSchema), taskUpdateController);
    router.patch('/task/:id', authValidator, schemaValidator(taskStatusSchema), taskUpdateStatusController);
    router.delete('/task/:id', authValidator, taskDeleteController);
    
    routes to test
*/

describe("task controller test", async () => {
    //reset 
    beforeAll(async () => {
        await db.delete(usersTable)
            .where(
                eq(usersTable.email, 'taskTest@gmail.com')
            )
    });

    afterAll(async () => {
        await db.delete(usersTable)
            .where(
                eq(usersTable.email, 'taskTest@gmail.com')
            )
    });

    const req = request('http://localhost:4000');

    const localTime = new Date()
        .toLocaleTimeString(navigator.language, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
        .split(" ")[0]; //hh:mm format
    const localDate = new Date().toISOString().split("T")[0];

    //test data
    const testTask: TaskCreateType = {
        title: 'task title',
        description: 'task description',
        status: 'todo',
        timeToDo: localTime,
        deadline: localDate
    }


    /* 
        POST TASK
    */
    describe("task post controller", async () => {
        //reset 
        beforeAll(async () => {
            await db.delete(usersTable)
                .where(
                    eq(usersTable.email, 'taskTest@gmail.com')
                )
        });

        //normal test, should pass and return task
        it("should create a task", async () => {
            await req.post('/api/user/signup').send({
                email: 'taskTest@gmail.com',
                name: 'taskTest',
                password: 'password',
                confirmPassword: 'password'
            });

            const resUser = await req.post('/api/user/signin').send({
                email: 'taskTest@gmail.com',
                password: 'password'
            });

            const accessToken = resUser.body.accessToken;

            const res = await req.post('/api/task').send(testTask).set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(201);
        });

        //error test, auth error
        it("should throw error, user not found", async () => {
            const res = await req.post('/api/task').send(testTask).set('Authorization', `Bearer empty`);

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid token');
        });
    });


    /* 
        GET TASK
    */
    describe("task get controller", async () => {
        //reset 
        beforeAll(async () => {
            await db.delete(usersTable)
                .where(
                    eq(usersTable.email, 'taskTest@gmail.com')
                )
        });

        //normal test, should pass and return tasks
        it("should get and get all tasks, normal test", async () => {
            await req.post('/api/user/signup').send({
                email: 'taskTest@gmail.com',
                name: 'taskTest',
                password: 'password',
                confirmPassword: 'password'
            });

            const resUser = await req.post('/api/user/signin').send({
                email: 'taskTest@gmail.com',
                password: 'password'
            });

            const accessToken = resUser.body.accessToken;

            await req.post('/api/task').send(testTask).set('Authorization', `Bearer ${accessToken}`);

            const getAll = await req.get('/api/task').set('Authorization', `Bearer ${accessToken}`);

            expect(getAll.status).toBe(200);
            expect(getAll.body.tasks).toBeDefined();
            expect(getAll.body.tasks).toHaveLength(1);

            const get = await req.get(`/api/task/${getAll.body.tasks[0].id}`).set('Authorization', `Bearer ${accessToken}`);

            expect(get.status).toBe(200);
            expect(get.body.task).toMatchObject({
                id: get.body.task.id,
                title: testTask.title,
                description: testTask.description,
                status: testTask.status,
                deadline: new Date(testTask.deadline).toLocaleDateString(),
                timeToDo: new Date(testTask.timeToDo).toLocaleTimeString(),
            });
        })

        //error test, auth error
        it("should throw error, user not found", async () => {
            const res = await req.get('/api/task').send(testTask).set('Authorization', `Bearer empty`);

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid token');
        });
    });

    /* 
        PUT PATCH TASK
    */
    describe("task put patch controller", async () => {
        //reset 
        beforeAll(async () => {
            await db.delete(usersTable)
                .where(
                    eq(usersTable.email, 'taskTest@gmail.com')
                )
        });
        //normal test, should pass and update task
        it("should update task", async () => {
            await req.post('/api/user/signup').send({
                email: 'taskTest@gmail.com',
                name: 'taskTest',
                password: 'password',
                confirmPassword: 'password'
            });

            const resUser = await req.post('/api/user/signin').send({
                email: 'taskTest@gmail.com',
                password: 'password'
            });

            const accessToken = resUser.body.accessToken;

            const taskPost = await req.post('/api/task').send(testTask).set('Authorization', `Bearer ${accessToken}`);
            const taskId = taskPost.body.task.id;

            const update = await req.put(`/api/task/${taskId}`).send({
                title: 'new title'
            }).set('Authorization', `Bearer ${accessToken}`);

            const updateStatus = await req.patch(`/api/task/${taskId}`).send(
                {
                    status: "done" as
                        TaskStatusType
                }
            ).set('Authorization', `Bearer ${accessToken}`);


            expect(update.status).toBe(200);
            expect(updateStatus.status).toBe(200);
        });

        //error test, auth error
        it("should throw error, user not found", async () => {
            const res = await req.put(`/api/task/2398472937223`).send(testTask).set('Authorization', `Bearer empty`);

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid token');
        });
    });

    /* 
        PUT PATCH TASK
    */
    describe("task delete controller", async () => {
        //reset 
        beforeAll(async () => {
            await db.delete(usersTable)
                .where(
                    eq(usersTable.email, 'taskTest@gmail.com')
                )
        });
        //normal test, should pass and update task
        it("should update task", async () => {
            await req.post('/api/user/signup').send({
                email: 'taskTest@gmail.com',
                name: 'taskTest',
                password: 'password',
                confirmPassword: 'password'
            });

            const resUser = await req.post('/api/user/signin').send({
                email: 'taskTest@gmail.com',
                password: 'password'
            });

            const accessToken = resUser.body.accessToken;

            const taskPost = await req.post('/api/task').send(testTask).set('Authorization', `Bearer ${accessToken}`);
            const taskId = taskPost.body.task.id;

            const deleteTask = await req.delete(`/api/task/${taskId}`).send().set('Authorization', `Bearer ${accessToken}`);

            expect(deleteTask.status).toBe(200);
        });

        //error test, auth error
        it("should throw error, user not found", async () => {
            const res = await req.delete(`/api/task/2398472937223`).send(testTask).set('Authorization', `Bearer empty`);

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid token');
        });
    });
})