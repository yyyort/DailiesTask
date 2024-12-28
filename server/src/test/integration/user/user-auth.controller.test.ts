import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "../../../db/db";
import { usersTable } from "../../../db/schema";
import request from "supertest";
import { UserCreateType } from "../../../model/user.model";
import { eq } from "drizzle-orm";

describe("use controller test", async () => {

    //resets
    beforeAll(async () => {
        await db.delete(usersTable)
    });
    afterAll(async () => {
        await db.delete(usersTable)
    });

    /* 
        USER SIGN UP
    */
    describe("user sign up controller", async () => {
        const req = request('http://localhost:4000');

        //test data
        const user: UserCreateType = {
            email: 'test@email.com',
            password: 'password',
            confirmPassword: 'password',
            name: 'test'
        }


        console.log('user', user);

        //resets
        beforeAll(async () => {
            await db.delete(usersTable)
        });

        //normal test, should pass and return user
        it("should sign up a user", async () => {

            const res = await req.post('/api/user/signup').send({
                email: user.email,
                name: user.name,
                password: 'password',
                confirmPassword: 'password'
            });

            expect(res.status).toBe(201);
            expect(res.body.user).toMatchObject({
                email: user.email,
                name: user.name
            });
        });

        //error test, should throw error, email already exists
        it("should throw error, email already exists", async () => {

            await req.post('/api/user/signup').send({
                email: user.email,
                name: user.name,
                password: 'password',
                confirmPassword: 'password'
            });

            const res = await req.post('/api/user/signup').send({
                email: user.email,
                name: 'test2',
                password: 'password',
                confirmPassword: 'password'
            });

            expect(res.status).toBe(400);
        });

        //error test, should throw error, password and confirm password do not match
        it("should throw error, password and confirm password do not match", async () => {

            const res = await req.post('/api/user/signup').send({
                email: 'test2@gmail.com',
                name: 'test2',
                password: 'password',
                confirmPassword: 'password1'
            });

            expect(res.status).toBe(400);
        });
    });

    /* 
        USER SIGN IN
    */
    describe("user sign in controller", async () => {
        const req = request('http://localhost:4000');

        //test data
        const user: UserCreateType = {
            email: 'test@test.com',
            password: 'password',
            confirmPassword: 'password',
            name: 'test'
        }


        //resets
        beforeAll(async () => {
            await db.delete(usersTable)
        });


        //error test should throw error, user does not exist
        it("should throw error, user does not exist", async () => {
            const res = await req.post('/api/user/signin').send({
                email: user.email,
                password: 'password'
            });

            expect(res.status).toBe(400);
        });

        //normal test, should pass and return user
        it("should sign in a user", async () => {
            await req.post('/api/user/signup').send({
                email: user.email,
                name: user.name,
                password: 'password',
                confirmPassword: 'password'
            });

            const res = await req.post('/api/user/signin').send({
                email: user.email,
                password: 'password'
            });

            expect(res.status).toBe(200);
            expect(res.body.user).toMatchObject({
                email: user.email,
                name: user.name
            });
        });

        it("should throw error, invalid email or password", async () => {
            const res = await req.post('/api/user/signin').send({
                email: user.email,
                password: 'password1'
            });

            expect(res.status).toBe(400);
        });
    });

    /* 
        USER GET
    */
    describe("user get controller", async () => {
        const req = request('http://localhost:4000');

        //test data
        const user: UserCreateType = {
            email: 'test@test.com',
            password: 'password',
            confirmPassword: 'password',
            name: 'test'
        }

        //resets
        beforeAll(async () => {
            await db.delete(usersTable)
        });

        //normal test, should pass and return user
        it("should retrieve user", async () => {
            //sign up and sign in user
            const create = await req.post('/api/user/signup').send({
                email: user.email,
                name: user.name,
                password: 'password',
                confirmPassword: 'password'
            });

            const userSignedIn = create.body.user;

            const res = await req.get(`/api/user/${userSignedIn.id}`).set('Authorization', `Bearer ${create.body.accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.user).toMatchObject({
                id: userSignedIn.id,
                email: user.email,
                name: user.name
            });
        });
    });


    /* 
        USER UPDATE
    */
    describe("user update controller", async () => {
        const req = request('http://localhost:4000');

        //test data
        const user: UserCreateType = {
            email: 'test@test.com',
            password: 'password',
            confirmPassword: 'password',
            name: 'test'
        }


        //resets
        beforeAll(async () => {
            await db.delete(usersTable)
        });


        //normal test, should pass and return user
        it("should update user, and return new user value", async () => {

            //sign up and sign in user
            await req.post('/api/user/signup').send({
                email: user.email,
                name: user.name,
                password: 'password',
                confirmPassword: 'password'
            });

            const create = await req.post('/api/user/signin').send({
                email: user.email,
                password: 'password'
            });

            const userSignedIn = create.body.user;

            const res = await req
                .put(`/api/user/${userSignedIn.id}`)
                .set('Authorization', `Bearer ${create.body.accessToken}`)
                .send({
                    email: 'neverused@neverused.com'
                });

            expect(res.status).toBe(200);

            //get user
            const getUser = await db.select({
                email: usersTable.email,
            }).from(usersTable).where(
                eq(usersTable.id, userSignedIn.id)
            ).limit(1);

            expect(getUser[0].email).toBe(
                'neverused@neverused.com');
        });
    });

    /* 
        DELTE USER
    */
    describe("user delete controller", async () => {
        const req = request('http://localhost:4000');

        //test data
        const user: UserCreateType = {
            email: 'test@test.com',
            password: 'password',
            confirmPassword: 'password',
            name: 'test'
        }


        //resets
        beforeAll(async () => {
            await db.delete(usersTable)
        });

        //normal test, should pass and return user
        it("should delete user", async () => {

            //sign up and sign in user
            await req.post('/api/user/signup').send({
                email: user.email,
                name: user.name,
                password: 'password',
                confirmPassword: 'password'
            });
            const create = await req.post('/api/user/signin').send({
                email: user.email,
                password: 'password'
            });
            const userSignedIn = create.body.user;

            await req
                .delete(`/api/user/${userSignedIn.id}`)
                .set('Authorization', `Bearer ${create.body.accessToken}`)


            const getUser = await db.select({
                email: usersTable.email,
            }).from(usersTable).where(
                eq(usersTable.id, userSignedIn.id)
            ).limit(1);

            expect(getUser.length).toBe(0);
        });
    });
});

