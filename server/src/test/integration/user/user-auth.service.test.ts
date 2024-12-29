import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db } from '../../../db/db';
import { usersTable } from '../../../db/schema';
import { UserCreateType, UserReturnType } from '../../../model/user.model';
import { userCreateService, userSignInService } from '../../../service/user.service';
import { eq } from 'drizzle-orm';

describe("user auth service functions test", async () => {

    //resets
    beforeAll(async () => {
        await db.delete(usersTable)
            .where(
                eq(usersTable.email, 'userAuth@gmail.com')
            )
    });
    afterAll(async () => {
        await db.delete(usersTable)
            .where(
                eq(usersTable.email, 'userAuth@gmail.com')
            )
    });

    //test data
    const user: UserCreateType = {
        email: 'userAuth@gmail.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'test'
    }

    /* 
          CREATE USER
      */
    //test user creation
    describe("user create service", async () => {
        //normal test, should pass and return user
        it("should create a user", async () => {
            const userCreated: UserReturnType = await userCreateService({
                email: user.email,
                password: user.password,
                confirmPassword: user.confirmPassword,
                name: user.name
            });

            expect(userCreated).toBeDefined();
            expect(userCreated).toMatchObject({
                email: user.email,
                name: user.name
            })
        });

        //error test, should throw error, email already exists
        it("should throw error, email already exists", async () => {
            await expect(
                userCreateService({
                    email: user.email,
                    password: user.password,
                    confirmPassword: user.confirmPassword,
                    name: user.name
                })
            ).rejects.toThrowError('User already exists');
        });
    });



    /* 
           SIGN IN USER
       */
    //test user sign in
    describe("user sign in service", async () => {
        //error test should throw error, user does not exist
        it("should throw error, user does not exist", async () => {
            await expect(
                userSignInService({
                    email: 'notexist@gmail.com',
                    password: 'password'
                })
            ).rejects.toThrowError('Invalid email or password');
        });

        //normal test, should pass and return user
        it("should sign in user", async () => {

            const userSignedIn: UserReturnType = await userSignInService({
                email: user.email,
                password: user.password
            });

            expect(userSignedIn).toBeDefined();
            expect(userSignedIn).toMatchObject({
                id: userSignedIn.id,
                email: user.email,
                name: user.name
            })
        });

        //error test, should throw error, wrong password
        it("should throw error, wrong password", async () => {
            await expect(
                userSignInService({
                    email: user.email,
                    password: 'wrongpassword'
                })
            ).rejects.toThrowError('Invalid email or password');
        });
    });

});