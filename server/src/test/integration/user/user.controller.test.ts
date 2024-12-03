import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { UserCreateType } from "../../../model/user.model";
import request from "supertest";
import { db } from "../../../db/db";
import { usersTable } from "../../../db/schema";
import { v4 as uuid } from "uuid";

describe("user controller integration test", () => {
    const testUser: UserCreateType = {
        email: "userTest@gmail.com",
        password: "password",
        confirmPassword: "password",
    }

    const req = request("http://localhost:4000"); //change to your server url

    //reset db before each test
    beforeEach(async () => {
        await db.delete(usersTable)
    })

    beforeAll(async () => {
        await db.delete(usersTable)
    })

    afterEach(async () => {
        // Final cleanup
        await db.delete(usersTable)
    })

    afterAll(async () => {
        // Final cleanup
        await db.delete(usersTable)
    })


    // user sign up
    describe("user sign up, /api/user/signup", async () => {
        // normal test
        it("should sign up a user, respond with status 201 and return the user", async () => {
            const res = await req.post("/api/user/signup").send(testUser);

            expect(res.status).toBe(201);
            expect(res.body.user).toMatchObject({
                id: expect.any(String),
                email: testUser.email,
            });
            expect(res.body.accessToken).toBeTruthy();
        });

        // error test: user already exists
        it("should throw an error if user already exists", async () => {
            //create user
            const post = await req.post("/api/user/signup").send(testUser);

            const res = await req.post("/api/user/signup").send(testUser);

            expect(post.status).toBe(201);
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("User already exists");
        });

    });


    // user sign in
    describe("user sign up, /api/user/signin", async () => {
        // normal test
        it("should sign in a user, respond with status 200 and return the user", async () => {
            const post = await req.post("/api/user/signup").send(testUser);

            const res = await req.post("/api/user/signin").send({
                email: testUser.email,
                password: testUser.password,
            });

            expect(post.status).toBe(201);
            expect(res.status).toBe(200);
            expect(res.body.user).toMatchObject({
                id: expect.any(String),
                email: testUser.email,
            });
            expect(res.body.accessToken).toBeTruthy();
        });

        // error test: user wrong password
        it("should throw an error if wrong credentials", async () => {
            //create user
            await req.post("/api/user/signup").send(testUser);

            const res = await req.post("/api/user/signin").send(
                {
                    email: testUser.email,
                    password: "wrongPassword",
                }
            );

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid email or password");
        });

        // error test: user not found
        it("should throw an error if user not found", async () => {
            //create user
            await req.post("/api/user/signup").send(testUser);

            const res = await req.post("/api/user/signin").send(
                {
                    email: "notfound@notFound.com",
                    password: testUser.password,
                }
            );

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User not found");
        });
    });

    // user get
    describe("user get, /api/user/:id", async () => {
        // normal test
        it("should get a user, respond with status 200 and return the user", async () => {
            //create user
            const user = await req.post("/api/user/signup").send(testUser);
            const userId = user.body.user.id;
            const accessToken = user.body.accessToken;

            const res = await req.get(`/api/user/${userId}`).set("Authorization", `Bearer ${accessToken}`);


            expect(res.status).toBe(200);
            expect(res.body.user).toMatchObject({
                id: userId,
                email: testUser.email,
            });
        });

        // error test: invalid id
        it("should throw an error if user not found", async () => {
            //create user
            const user = await req.post("/api/user/signup").send(testUser);
            const accessToken = user.body.accessToken;

            const res = await req.get(`/api/user/invalid`).set("Authorization", `Bearer ${accessToken}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid id");
        });

        // error test: user not found
        it("should throw an error if user not found", async () => {
            //create user
            const user = await req.post("/api/user/signup").send(testUser);
            const accessToken = user.body.accessToken;

            const res = await req.get(`/api/user/${uuid()}`).set("Authorization", `Bearer ${accessToken}`);

            console.log(res.body);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User not found");
        });

        // error test: unauthorized
        it("should throw an error if unauthorized", async () => {
            //create user
            const user = await req.post("/api/user/signup").send(testUser);
            const userId = user.body.user.id;

            const res = await req.get(`/api/user/${userId}`);

            console.log(res.body);

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
        });

        // error test: invalid token
        it("should throw an error if invalid token", async () => {
            //create user
            const user = await req.post("/api/user/signup").send(testUser);
            const userId = user.body.user.id;

            const res = await req.get(`/api/user/${userId}`).set("Authorization", `Bearer invalidToken`);

            console.log(res.body);

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Invalid token");
        });
    });

    // user update
    describe("user update /api/user/:id", async () => {

        // normal test
        it("should update a user, respond with status 200 and return the user", async () => {
            //create user for update test
            const user = await req.post("/api/user/signup").send(testUser);
            const userId = user.body.user.id;
            const accessToken = user.body.accessToken;

            // email update
            const res = await req.put(`/api/user/${userId}`).send({
                email: "newEmail@email.com",
            }).set("Authorization", `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.user).toMatchObject({
                id: userId,
                email: "newEmail@email.com"
            });

            // password update
            const res2 = await req.put(`/api/user/${userId}`).send({
                email: "newEmail@email.com",
            }).set("Authorization", `Bearer ${accessToken}`);

            expect(res2.status).toBe(200);
            expect(res2.body.user).toMatchObject({
                id: userId,
                email: "newEmail@email.com"
            });

        });

        // error test: invalid id
        it("should throw an error if invalid id", async () => {
            //create user for update test
            const user = await req.post("/api/user/signup").send(testUser);
            const accessToken = user.body.accessToken;

            const res = await req.put(`/api/user/invalid`).send({
                email: "newEmail@email.com",
            }).set("Authorization", `Bearer ${accessToken}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid id");
        });

        // error test: user not found
        it("should throw an error if user not found", async () => {
            //create user for update test
            const user = await req.post("/api/user/signup").send(testUser);
            const accessToken = user.body.accessToken;

            const res = await req.put(`/api/user/${uuid()}`).send({
                email: "newEmail@email.com",
            }).set("Authorization", `Bearer ${accessToken}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User not found");
        });

        // error test: unauthorized
        it("should throw an error if unauthorized", async () => {
            //create user for update test
            const user = await req.post("/api/user/signup").send(testUser);
            const userId = user.body.user.id;

            const res = await req.put(`/api/user/${userId}`).send({
                email: "newEmail@email.com",
            });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
        });
    });


    // user delete
    describe("user delete /api/user/:id", async () => {

        it("should delete a user, respond with status 200 and return the user", async () => {
            //create user for delete test
            const user = await req.post("/api/user/signup").send(testUser);
            const userId = user.body.user.id;
            const accessToken = user.body.accessToken;

            const res = await req.delete(`/api/user/${userId}`).set("Authorization", `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.user).toMatchObject({
                id: userId,
                email: testUser.email
            });
        });

        // error test: invalid id
        it("should throw an error if invalid id", async () => {
            //create user for delete test
            const user = await req.post("/api/user/signup").send(testUser);
            const accessToken = user.body.accessToken;

            const res = await req.delete(`/api/user/invalid`).set("Authorization", `Bearer ${accessToken}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid id");
        });

        // error test: user not found
        it("should throw an error if user not found", async () => {
            //create user for delete test
            const user = await req.post("/api/user/signup").send(testUser);
            const accessToken = user.body.accessToken;

            const res = await req.delete(`/api/user/${uuid()}`).set("Authorization", `Bearer ${accessToken}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User not found");
        });

        // error test: unauthorized
        it("should throw an error if unauthorized", async () => {
            //create user for delete test
            const user = await req.post("/api/user/signup").send(testUser);
            const userId = user.body.user.id;

            const res = await req.delete(`/api/user/${userId}`);

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
        });
    });

});