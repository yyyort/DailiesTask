import { UserCreateType, UserModelType, UserSignInType, UserUpdateType } from "@workspace/types";
import { db } from "..";
import { eq, usersTable, and, } from "@workspace/database";
import { ApiError } from "../lib/apiError";
import bcrypt from "bcrypt";


/* 
    Create a new user
*/
export async function userCreateService(data: UserCreateType): Promise<UserModelType> {
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

            if (userExist.length >= 1) {
                throw new ApiError(400, "User already exists", {
                    message: "User already exists"
                });
            }


            //hash password
            const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            if (!hashedPassword) {
                throw new ApiError(500, "Error hashing password", {
                    message: "Error hashing password"
                });
            }

            //create user
            const user = await trx
                .insert(usersTable)
                .values({
                    email: data.email,
                    username: data.username,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    password: hashedPassword,
                    birthdate: data.birthdate ? new Date(data.birthdate).toISOString() : new Date().toISOString(), 
                    profilePicture: data.profilePicture || null,
                    lastLogin: new Date().toISOString()
                })
                .returning().then((res) => {
                    const dbUser = res[0];
                    return {
                        ...dbUser,
                        lastLogin: new Date(dbUser.lastLogin),
                        birthdate: new Date(dbUser.birthdate)
                    };
                }).catch((error) => {
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

