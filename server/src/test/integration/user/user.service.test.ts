import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../../db/db";
import { UserCreateType, UserReturnType } from "../../../model/user.model";
import { userCreateService, userDeleteService, userGetService, userSignInService, userUpdateService } from "../../../service/user.service";
import { usersTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

describe("user service integration test", () => {
    const testUser: UserCreateType = {
        email: "example@example.com",
        password: "password",
        confirmPassword: "password",
    }

    //reset db before each test
    beforeEach(async () => {
        await db.delete(usersTable).where(
            eq(usersTable.email, testUser.email)
        )
    })
    afterAll(async () => {
        // Final cleanup
        await db.delete(usersTable)
            .where(eq(usersTable.email, testUser.email))
    })

    //test user create service
    it("should create a user and return the user", async () => {
        const user = await userCreateService(testUser);

        expect(user).toMatchObject<UserReturnType>({
            id: expect.any(String),
            email: testUser.email,
        });
    });

    //test user create service with existing user
    it("should throw an error if user already exists", async () => {
        //create user
        await userCreateService(testUser);

        await expect(userCreateService(testUser)).rejects.toThrowError("User already exists");
    });

    //test user sign in service
    it("should sign in a user and return the user", async () => {
        //create user
        await userCreateService(testUser);

        //sign in user
        const user = await userSignInService(testUser);

        expect(user).toMatchObject<UserReturnType>({
            id: expect.any(String),
            email: testUser.email,
        });
    });

    //test user get service
    it("should get a user and return the user", async () => {
        const user = await userCreateService(testUser);

        const test = await userGetService(user.id);

        expect(test).toMatchObject<UserReturnType>({
            id: user.id,
            email: user.email,
        });
    });

    //test user get service with non existing user
    it("should throw an error User not found if user does not exist", async () => {
        await expect(userGetService(uuidv4())).rejects.toThrowError("No user found with that id");
    });

    //test user update service
    it("should update a user and return the user", async () => {
        const user = await userCreateService(testUser);

        const updatedUser = await userUpdateService(user.id, {
            email: "updated@gmail.com",
        })

        expect(updatedUser).toMatchObject<UserReturnType>({
            id: user.id,
            email: "updated@gmail.com",

        });

        //delete user
        await db.delete(usersTable).where(
            eq(usersTable.id, updatedUser.id)
        )
    });

    //test user update, update password
    it("should update a user password and return the user", async () => {
        const user = await userCreateService(testUser);

        const updatedUser = await userUpdateService(user.id, {
            password: "updatedPassword",
        })

        expect(updatedUser).toMatchObject<UserReturnType>({
            id: user.id,
            email: user.email,
        });
    });

    //test user update service with non existing user
    it("should return user does not exist", async () => {
        await expect(userUpdateService(uuidv4(), {
            email: "test@gmail.com",})).rejects.toThrowError("No user found with that id");
    });

    //test user delete service
    it("should delete a user and return the user", async () => {
        const user = await userCreateService(testUser);

        const deletedUser = await userDeleteService(user.id);

        expect(deletedUser).toMatchObject<UserReturnType>({
            id: user.id,
            email: user.email,
        });
    });
});