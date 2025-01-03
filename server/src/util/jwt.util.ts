import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from './apiError';
import dotenv from 'dotenv';
import { db } from '../db/db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';

dotenv.config();


export async function verifyToken(token: string, type: 'refresh' | 'access'): Promise<
    {
        id: string,
        email: string,
        name: string,
        accessToken: string
    }> {

    const secret = type === 'refresh' ? process.env.REFRESH_TOKEN_SECRET! as string : process.env.ACCESS_TOKEN_SECRET! as string;

    try {
        const decoded = jwt.verify(
            token,
            secret
        ) as JwtPayload;

        const payload = decoded;

        if (!payload) {
            throw new ApiError(401, 'Invalid token payload', {});
        }

        const selectUser = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                name: usersTable.name
            })
            .from(usersTable)
            .where(eq(usersTable.id, payload.id))
            .catch((error) => {
                throw new ApiError(401, error, {
                    message: 'User not found'
                });
            });


        if (!selectUser) {
            throw new ApiError(401, 'User not found', {});
        }

        const user = selectUser[0];


        if (!user) {
            throw new ApiError(401, 'User not found', {});
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET! as string,
            {
                expiresIn: '15m',
            });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            accessToken: accessToken
        }
    } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, 'Token expired', error);
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, 'Invalid token', error);
        } else if (error instanceof jwt.NotBeforeError) {
            throw new ApiError(401, 'Token not active', error);
        } else if (error instanceof ApiError) {
            throw error;
        } else {
            throw new Error((error as Error).message);
        }
    }
}