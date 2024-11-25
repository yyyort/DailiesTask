import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { UserModelType } from "../../model/user.model";
import { db } from "../../db/db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { doesUserExist } from "../../util/user.util";
import { v4 as uuidv4 } from "uuid";

describe("doesUserExist integration test", () => {
    const testUser: UserModelType = {
        id: uuidv4(),
        email: "example@example.com",
        password: "password",
        createdAt: new Date(),
        updatedAt: new Date(),
    }

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

    // Test if user exists
    it("should return true if user exists", async () => {
        await db.insert(usersTable).values(testUser);

        const exist = await doesUserExist(testUser.email);

        expect(exist).toBe(true);
    })

    //test if user does not exist but there is a user in the db
    it("should return false if user does not exist", async () => {
        await db.insert(usersTable).values(testUser);

        const exist = await doesUserExist(
            "notexist@gmail.com"
        );

        expect(exist).toBe(false);
    })

    //test if user does not exist and there is no user in the db
    it("should return false if user does not exist", async () => {
        const exist = await doesUserExist(
            "notexist@gmail.com"
        );

        expect(exist).toBe(false);
    })

    //test it if database encounters an error
    it("should throw an error when the database encounters an error", async () => {
        vi.spyOn(db, "select").mockImplementationOnce(() => {
            throw new Error("Database error");
        })

        await expect(doesUserExist(testUser.email)).rejects.toThrowError("Database error");
    });
});