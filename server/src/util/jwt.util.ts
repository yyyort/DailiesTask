import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from './apiError';
import dotenv from 'dotenv';
import { userGetService } from '../service/user.service';

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

        const payload = decoded as { id: string, email: string };

        if (!payload.id || !payload.email) {
            throw new ApiError(401, 'Invalid token payload', {});
        }

        const user = await userGetService(payload.id);

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