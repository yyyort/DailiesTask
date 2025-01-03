import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../util/jwt.util";
import { ApiError } from "../util/apiError";

export const authValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new ApiError(401, 'Unauthorized', {});
        }

        const token = authHeader!.split(' ')[1];

        const payload = await verifyToken(token, 'access');

        if (!payload) {
            throw new ApiError(401, 'Unauthorized', {});
        }

        const { id } = payload;
        req.body.userId = id;


        next();
    } catch (error: unknown) {
        console.error((error as Error).message);
        console.error(error);
        console.error('authValidator error got error here');
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: (error as Error).message });
    }
}