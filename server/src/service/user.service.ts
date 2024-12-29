import { db } from "../db/db";

import { usersTable } from "../db/schema";
import bcrypt from "bcrypt";
import { UserCreateType, UserUpdateType, UserReturnType, UserSignInType } from "../model/user.model";
import { ApiError } from "../util/apiError";
import { and, eq, notExists } from "drizzle-orm";

/* 
    Create a new user
*/
export async function userCreateService(data: UserCreateType): Promise<UserReturnType> {
    try {
        const user = await db.transaction(async (trx) => {
            //check if email already exists
            const userExist = await trx
                .select({
                    email: usersTable.email,
                })
                .from(usersTable)
                .where(
                    eq(usersTable.email, data.email)
                )
                .limit(1);

            console.log('find me bitx', userExist);

            if (userExist.length >= 1) {
                console.log('find me bitx 2', userExist);

                throw new ApiError(400, "User already exists", {
                    message: "User already exists"
                });
            }


            //hash password
            const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            //create user
            const user = await db
                .insert(usersTable)
                .values({
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                })
                .returning({
                    id: usersTable.id,
                    email: usersTable.email,
                    name: usersTable.name,
                }).then((res) => res[0]).catch((error) => {
                    throw new Error(error.message);
                });

            return user;

        });

        return user;


    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}

/* 
    Sign in user
*/
export async function userSignInService(data: UserSignInType): Promise<UserReturnType> {
    try {
        //get user from db
        const user = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                password: usersTable.password,
                name: usersTable.name,
            })
            .from(usersTable)
            .where(eq(usersTable.email, data.email))
            .limit(1);

        //if there is no user
        if (user.length <= 0) {
            throw new ApiError(400, "Invalid email or password", {
                message: "Invalid email or password"
            });
        }

        //compare password
        const match = await bcrypt.compare(data.password, user[0].password);

        if (!match) {
            throw new ApiError(400, "Invalid email or password", {
                message: "Invalid email or password"
            });
        }

        return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
        };

        //return user
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}


/* 
    Get user by id
*/
export async function userGetService(id: string): Promise<UserReturnType> {
    try {

        // if id undefined or invalid
        if (!id || id.length !== 36) {
            throw new ApiError(400, "Invalid id", {
                message: "Invalid id"
            });
        }

        //get user
        const user = await db.selectDistinct(
            {
                id: usersTable.id,
                email: usersTable.email,
                name: usersTable.name,
            }
        ).from(usersTable).where(eq(usersTable.id, id)).limit(1);

        //if user is not found
        if (user.length <= 0) {
            throw new ApiError(404, "User not found", {});
        }

        return user[0];
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}

/* 
    Update user by id
*/
export async function userUpdateService(id: string, data: UserUpdateType): Promise<UserReturnType> {
    try {
        const user: UserReturnType = await db.transaction(async (trx) => {
            //get user
            const user = await trx
                .select({
                    id: usersTable.id,
                    email: usersTable.email,
                    name: usersTable.name,
                })
                .from(usersTable)
                .where(eq(usersTable.id, id))
                .limit(1);

            //if user is not found
            if (user.length <= 0) {
                throw new ApiError(404, "User not found", {});
            }

            if (data.email) {
                //check if email already exists
                const userExist = await trx
                    .select({
                        email: usersTable.email,
                    })
                    .from(usersTable)
                    .where(
                        eq(usersTable.email, data.email)
                    )

                if (userExist.length >= 1) {
                    throw new ApiError(400, "Email already exists", {});
                }
            }

            if (data.password) {
                //hash password
                const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
                const hashedPassword = await bcrypt.hash(data.password, saltRounds);

                //update user
                const updatedUser = await trx
                    .update(usersTable)
                    .set({
                        email: data.email,
                        password: hashedPassword,
                        name: data.name,
                    })
                    .where(eq(usersTable.id, id))
                    .returning({
                        id: usersTable.id,
                        email: usersTable.email,
                        name: usersTable.name,
                    });

                return updatedUser[0];
            }

            //update user
            const updatedUser = await trx
                .update(usersTable)
                .set({
                    email: data.email,
                    name: data.name,
                })
                .where(
                    and(
                        eq(usersTable.id, id),
                        notExists(
                            trx.select()
                                .from(usersTable)
                                .where(eq(usersTable.email, data?.email ?? ''))
                        )
                    )
                )
                .returning({
                    id: usersTable.id,
                    email: usersTable.email,
                    name: usersTable.name,
                });

            return updatedUser[0];
        });

        return user;

    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        return {
            id: "",
            email: "",
            name: ""
        }
    }
}


/* 
    Delete user by id
*/
export async function userDeleteService(id: string): Promise<UserReturnType> {
    try {
        //get user
        const user: UserReturnType[] = await db
            .delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning({
                id: usersTable.id,
                email: usersTable.email,
                name: usersTable.name
            });

        //if user is not found
        if (user.length <= 0) {
            throw new ApiError(404, "User not found", {});
        }

        return user[0];
    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
    }
}
