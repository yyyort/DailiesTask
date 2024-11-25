import { db } from "../db/db";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";

//util for checking if user exist in database
export async function doesUserExist(email: string): Promise<Boolean> {
    try {
        const userExist = await db
            .select({
                email: usersTable.email,
            })
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        if (userExist.length > 0) {
            return true;
        }

        console.log(userExist);

        return false;
    } catch (error: unknown) {
        throw new Error((error as Error).message);
    }
}
