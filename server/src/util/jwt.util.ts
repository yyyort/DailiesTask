import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from './apiError';
import dotenv from 'dotenv';

dotenv.config();


export async function verifyToken(token: string): Promise<JwtPayload> {

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

        return payload as JwtPayload;
    } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, 'Token expired', error);
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, 'Invalid token', error);
        } else if (error instanceof jwt.NotBeforeError) {
            throw new ApiError(401, 'Token not active', error);
        } else {
            throw new Error((error as Error).message);
        }
    }
}