import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db } from '../../../db/db';
import { usersTable } from '../../../db/schema';
import { UserCreateType, UserReturnType } from '../../../model/user.model';
import { userCreateService, userDeleteService, userSignInService, userUpdateService } from '../../../service/user.service';
import { v4 as uuidv4 } from 'uuid';

describe("user auth service test", async () => {

    //resets
    beforeAll(async () => {
        await db.delete(usersTable)
    });
    afterAll(async () => {
        await db.delete(usersTable)
    });

    //test data
    const user: UserCreateType = {
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
        name: 'test'
    }

    /* 
          CREATE USER
      */
    //test user creation
    describe("user create service", async () => {
        //resets
        beforeAll(async () => {
            await db.delete(usersTable)
        });


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
        //resets
        beforeAll(async () => {
            await db.delete(usersTable)
        });

        //error test should throw error, user does not exist
        it("should throw error, user does not exist", async () => {
            await expect(
                userSignInService({
                    email: user.email,
                    password: 'password'
                })
            ).rejects.toThrowError('Invalid email or password');
        });

        //normal test, should pass and return user
        it("should sign in user", async () => {

            await userCreateService({
                email: user.email,
                password: user.password,
                confirmPassword: user.confirmPassword,
                name: user.name
            });

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



    /* 
        UPDATE USER
    */
    describe("user update service", async () => {
        //resets
        beforeAll(async () => {
            await db.delete(usersTable)
        });

        //error test, should throw error, user does not exist
        it("should throw error, user does not exist", async () => {
            await expect(
                userUpdateService(
                    uuidv4(),
                    {
                        email: 'sdafklajsasd@gmail.com'
                    }
                )
            ).rejects.toThrowError('User not found');
        });

        //normal test, should pass and return user
        it("should update user", async () => {
            //test data
            const user: UserCreateType = {
                email: 'test324@test.com',
                password: 'password',
                confirmPassword: 'password',
                name: 'test'
            }

            const userCreated: UserReturnType = await userCreateService(user);

            const userUpdated: UserReturnType = await userUpdateService(
                userCreated.id,
                {
                    email: "Nnsdfssadfdg@gmail.com"
                }
            );

            expect(userUpdated).toBeDefined();
            expect(userUpdated).toMatchObject({
                id: userCreated.id,
                email: "Nnsdfssadfdg@gmail.com",
                name: userCreated.name
            })
        });
    })


    /* 
          DELETE USER
      */
    describe("user delete service", async () => {

        //resets
        beforeAll(async () => {
            await db.delete(usersTable)
        });

        //error test, should throw error, user does not exist
        it("should throw error, user does not exist", async () => {
            await expect(
                userDeleteService(uuidv4())
            ).rejects.toThrowError('User not found');
        }
        )

        //normal test, should pass and return user
        it("should delete user", async () => {
            const userCreated: UserReturnType = await userCreateService({
                email: user.email,
                password: user.password,
                confirmPassword: user.confirmPassword,
                name: user.name
            });

            const userDeleted: UserReturnType = await userDeleteService(userCreated.id);

            expect(userDeleted).toBeDefined();
            expect(userDeleted).toMatchObject({
                email: user.email,
                name: user.name
            })
        });
    })
});