import { NextFunction, Response, Request } from "express";
import { ZodSchema } from "zod";

export const schemaValidator = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: unknown) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}