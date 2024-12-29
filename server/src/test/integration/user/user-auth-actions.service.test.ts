
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { userCreateService, userDeleteService, userUpdateService } from "../../../service/user.service";
import { UserCreateType, UserReturnType } from "../../../model/user.model";
import { db } from "../../../db/db";
import { usersTable } from "../../../db/schema";
import { eq, inArray } from 'drizzle-orm';

describe("user update service", async () => {
    //test data
    const user: UserCreateType = {
        email: 'authAction@gmail.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'test'
    }

    //resets
    afterAll(async () => {
        await db.delete(usersTable)
            .where(
                eq(usersTable.email, user.email)

            )
    });

    beforeAll(async () => {
        await db.delete(usersTable)
            .where(
                inArray(usersTable.email, [
                    user.email,
                    'toBeDelete@gmail.com'
                ])
            )
    });



    //normal test, should pass and return user
    it("should update user", async () => {

        //create user
        const userCreated: UserReturnType = await userCreateService({
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword,
            name: user.name
        });


        //test data
        const userUpdated: UserReturnType = await userUpdateService(
            userCreated.id,
            {
                name: 'updated test'
            }
        );

        expect(userUpdated).toBeDefined();
        expect(userUpdated).toMatchObject({
            id: userCreated.id,
            name: 'updated test'
        })
    });

    //normal test, should pass and return user
    it("should delete user", async () => {

        //create user
        const userCreated: UserReturnType = await userCreateService({
            email: 'toBeDelete@gmail.com',
            password: user.password,
            confirmPassword: user.confirmPassword,
            name: user.name
        });


        const userDeleted: UserReturnType = await userDeleteService(userCreated.id);

        expect(userDeleted).toBeDefined();
    });
})

