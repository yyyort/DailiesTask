import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../util/jwt.util";
import { ApiError } from "../util/apiError";

export const authValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        console.log(authHeader);

        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).send('Unauthorized')
            return;
        }

        const token = authHeader!.split(' ')[1];

        console.log(token);

        const payload = await verifyToken(token, 'access');            

        const { id } = payload;

        req.body.userId = id;

        next();
    } catch (error: unknown) {
        console.error((error as Error).message);
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: (error as Error).message });
    }
}