import { db } from "../db/db";

import { usersTable } from "../db/schema";
import bcrypt from "bcrypt";
import { UserCreateType, UserUpdateType, UserReturnType, UserSignInType } from "../model/user.model";
import { doesUserExist } from "../util/user.util";
import { ApiError } from "../util/apiError";
import { eq } from "drizzle-orm";

/* 
    Create a new user
*/
export async function userCreateService(data: UserCreateType): Promise<UserReturnType> {
    try {
        //check if email already existss
        const userExist = await doesUserExist(data.email);

        if (userExist) {
            throw new ApiError(400, "User already exists", {});
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
            })
            .returning({
                id: usersTable.id,
                email: usersTable.email,
            });

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
            })
            .from(usersTable)
            .where(eq(usersTable.email, data.email))
            .limit(1);

        //if there is no user
        if (user.length <= 0) {
            throw new ApiError(404, "User not found", {});
        }

        //compare password
        const match = await bcrypt.compare(data.password, user[0].password);

        if (!match) {
            throw new ApiError(400, "Invalid email or password", {});
        }

        return {
            id: user[0].id,
            email: user[0].email,
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
        // if id undefined or invalid
        if (!id || id.length !== 36) {
            throw new ApiError(400, "Invalid id", {
                message: "Invalid id"
            });
        }

        //if password is provided hash it
        if (data?.password) {
            const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
            const encryptedPassword = await bcrypt.hash(data.password, saltRounds);

            //update user
            const user: UserReturnType[] = await db
                .update(usersTable)
                .set({
                    email: data?.email,
                    password: encryptedPassword,
                })
                .where(eq(usersTable.id, id))
                .returning(
                    {
                        id: usersTable.id,
                        email: usersTable.email,
                    }
                );

            //if user is not found
            if (user.length <= 0) {
                throw new ApiError(404, "User not found", {});
            }

            return user[0];
        } else {
            //update user
            const user: UserReturnType[] = await db
                .update(usersTable)
                .set({
                    email: data?.email,
                })
                .where(eq(usersTable.id, id))
                .returning();

            //if user is not found
            if (user.length <= 0) {
                throw new ApiError(404, "User not found", {});
            }

            return user[0];
        }


    } catch (error: unknown) {
        console.error((error as Error));
        if (error instanceof ApiError) {
            throw error;
        }

        throw new Error((error as Error).message);
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
