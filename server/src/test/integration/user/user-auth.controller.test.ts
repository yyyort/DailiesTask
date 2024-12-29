import { afterAll, describe, expect, it } from "vitest";
import { db } from "../../../db/db";
import { usersTable } from "../../../db/schema";
import request from "supertest";
import { UserCreateType } from "../../../model/user.model";
import { eq } from "drizzle-orm";

describe("auth api end point integration test", async () => {

    //resets
    afterAll(async () => {
        await db
            .delete(usersTable)
            .where(
                eq(usersTable.email, 'userAuthController@email.com')
            )
    });

    const req = request('http://localhost:4000');

    //test data
    const user: UserCreateType = {
        email: 'userAuthController@email.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'test'
    }

    it("user sign up, should expect 200 and user object", async () => {

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

    it("user sign up, error case: user already exist, should expect 400 and user already exist", async () => {
        const res = await req.post('/api/user/signup').send({
            email: user.email,
            name: user.name,
            password: 'password',
            confirmPassword: 'password'
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('User already exists');
    });

    it("user sign in, should expect 200 and accessToken", async () => {
        const res = await req.post('/api/user/signin')
            .send({
                email: user.email,
                password: 'password'
            });

        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user).toMatchObject({
            email: user.email,
            name: user.name
        });
    });

    it("user sign in, error case: wrong credentials, should expect 400 and message invalid email or password", async () => {
        const res = await req.post('/api/user/signin')
            .send({
                email: user.email,
                password: 'wrongpassword'
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid email or password');
    })

    it("user sign in, error case: user does not exist, should expect 400 and message invalid email or password", async () => {
        const res = await req.post('/api/user/signin')
            .send({
                email: 'wrongemail@gmail.com',
                password: 'wrongpassword'
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid email or password');
    })

});

