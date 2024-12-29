import { afterAll, describe, expect, it } from "vitest";
import { db } from "../../../db/db";
import request from "supertest";
import { usersTable } from "../../../db/schema";
import { UserCreateType, UserReturnType } from "../../../model/user.model";
import { eq } from "drizzle-orm";


describe("use api end point integration test", async () => {

    afterAll(async () => {
        await db
            .delete(usersTable)
            .where(
                eq(usersTable.email, 'userAuthAction@email.com',)
            )
    });

    const req = request('http://localhost:4000');

    //test data
    const user: UserCreateType = {
        email: 'userAuthAction@email.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'test'
    }

    //sign up user
    await req.post('/api/user/signup').send({
        email: user.email,
        name: user.name,
        password: 'password',
        confirmPassword: 'password'
    });

    //sign in user
    const resUser = await req.post('/api/user/signin').send({
        email: user.email,
        password: 'password'
    });

    const accessToken = resUser.body.accessToken;
    const signedInUser = resUser.body.user as UserReturnType;

    it("user get, should expect 200 and user object", async () => {
        console.log(signedInUser.id);

        const res = await req.get("/api/user/" + signedInUser.id).set('Authorization', "Bearer " + accessToken);

        expect(res.status).toBe(200);
        expect(res.body.user).toMatchObject({
            email: user.email,
            name: user.name
        });
    });

    it("user update, should expect 200 and user object", async () => {
        const res = await req.put(`/api/user/${signedInUser.id}`).send({
            name: 'newName'
        }).set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.user).toMatchObject({
            name: 'newName'
        });
    });

    it("user delete, should expect 200 and message user deleted", async () => {
        const res = await req.delete(`/api/user/${signedInUser.id}`).set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User deleted successfully');
    });
});
