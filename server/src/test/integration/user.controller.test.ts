
import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { db } from "../../db/db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { UserCreateType } from "../../model/user.model";
import { beforeEach } from "node:test";
import { userCreateService } from "../../service/user.service";
import { v4 as uuid } from "uuid";

describe("user controller integration test", () => {

    const req = request("http://localhost:4000");

    const userTest: UserCreateType = {
        email: "test@gmail.com",
        password: "password",
        confirmPassword: "password"
    }

    //clean ups
    beforeEach(async () => {
        await db.delete(usersTable).where(
            eq(usersTable.email, userTest.email)
        );
    });

    afterEach(async () => {
        await db.delete(usersTable).where(
            eq(usersTable.email, userTest.email)
        );
    });

    //signup test
    describe("POST /api/user/signup", () => {
        //normal case
        it('should return 201 if success', async () => {
            const res = await req
                .post('/api/user/signup')
                .send(userTest)
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("User created successfully");
        })
        //password and confirm password do not match
        it('should return 400 if password do not match', async () => {
            const res = await req
                .post('/api/user/signup')
                .send({
                    email: userTest.email,
                    password: "password",
                    confirmPassword: "1234"
                })

            expect(res.statusCode).toBe(400);
        });
        //no email
        it('should return 400 if no email', async () => {
            const res = await req
                .post('/api/user/signup')
                .send({
                    password: "password",
                    confirmPassword: "password"
                })

            expect(res.statusCode).toBe(400);
        });

        //no password
        it('should return 400 if no password', async () => {
            const res = await req
                .post('/api/user/signup')
                .send({
                    email: userTest.email
                })

            expect(res.statusCode).toBe(400);
        });

        //no confirm password
        it('should return 400 if no confirm password', async () => {
            const res = await req
                .post('/api/user/signup')
                .send({
                    email: userTest.email,
                    password: "password",
                })

            expect(res.statusCode).toBe(400);
        });

        //user already exists
        it('should return 400 if user already exist', async () => {
            //create user
            await db.insert(usersTable).values({
                email: "test@gmail.com",
                password: "password"
            });

            const res = await req
                .post('/api/user/signup')
                .send({
                    email: "test@gmail.com",
                    password: "password",
                    confirmPassword: "password"
                })

            expect(res.statusCode).toBe(400);
        });
    });

    //signin test
    describe("POST /api/user/signin", () => {
        //normal case
        it('should return 200 after successful sign in', async () => {
            //create user
            await userCreateService(userTest);

            const res = await req
                .post('/api/user/signin')
                .send({
                    email: userTest.email,
                    password: userTest.password
                })

            expect(res.statusCode).toBe(200);
        });

        //wrong password
        it('should return 400 if invalid login', async () => {
            //create user
            await userCreateService(userTest);

            const res = await req
                .post('/api/user/signin')
                .send({
                    email: userTest.email,
                    password: "1234"
                })

            expect(res.statusCode).toBe(400);
        })

        //no email
        it("should return 400 if no email", async () => {
            const res = await req
                .post('/api/user/signin')
                .send({
                    password: "password"
                })

            expect(res.statusCode).toBe(400);
        });

        //no password
        it("should return 400 if no password", async () => {
            const res = await req
                .post('/api/user/signin')
                .send({
                    email: userTest.email
                })

            expect(res.statusCode).toBe(400);
        });

        //no user
        it("should return 404 if user not found", async () => {
            const res = await req
                .post('/api/user/signin')
                .send({
                    email: userTest.email,
                    password: userTest.password
                })

            expect(res.statusCode).toBe(404);
        });
    });

    //get user test
    describe("GET /api/user/:id", () => {
        //normal case
        it('should return 200 if success', async () => {
            //create user
            const user = await userCreateService(userTest);

            const res = await req
                .get(`/api/user/${user.id}`)
            
            expect(res.statusCode).toBe(200);
        });

        //user not found
        it('should return 400 if user not found', async () => {
            const res = await req
                .get(`/api/user/${uuid()}`)
            
            expect(res.statusCode).toBe(400);
        });

        //no id
        it('should return 404 if no id', async () => {
            const res = await req
                .get(`/api/user/`)
            
            expect(res.statusCode).toBe(404);
        });

        //unauthorized
    });

    //update user test
    describe("PUT /api/user/:id", () => {
        //normal case
        it('should return 200 if success', async () => {
            //create user
            const user = await userCreateService(userTest);

            const res = await req
                .put(`/api/user/${user.id}`)
                .send({
                    email: "new email"
                })
            
            expect(res.statusCode).toBe(200);
        });
        
        //no user
        it('should return 400', async () => {
            const res = await req
                .put(`/api/user/${uuid()}`)
                .send({
                    email: "new email"
                })
            
            expect(res.statusCode).toBe(400);
        });

        //no id
        it('should return 404', async () => {
            const res = await req
                .put(`/api/user/`)
                .send({
                    email: "new email"
                })
            
            expect(res.statusCode).toBe(404);
        });

        //unauthorized
    });

    //delete user test
    describe("DELETE /api/user/:id", () => {
        //normal case
        it('should return 200', async () => {
            //create user
            const user = await userCreateService(userTest);

            const res = await req
                .delete(`/api/user/${user.id}`)
            
            expect(res.statusCode).toBe(200);
        });


        //no user
        it('should return 400', async () => {
            const res = await req
                .delete(`/api/user/${uuid()}`)
            
            expect(res.statusCode).toBe(400);
        });

        //no id
        it('should return 404', async () => {
            const res = await req
                .delete(`/api/user/`)
            
            expect(res.statusCode).toBe(404);
        });

        //unauthorized
    });
});
