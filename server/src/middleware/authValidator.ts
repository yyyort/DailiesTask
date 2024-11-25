import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../util/jwt.util";

export const authValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
    
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).send('Unauthorized')
            return;
        }

        const token = authHeader!.split(' ')[1];

        const payload = await verifyToken(token);

        const { id } = payload;

        req.body.userId = id;

        next();
    } catch (error: unknown) {
        res.status(400).json({ message: (error as Error).message });
    }
}