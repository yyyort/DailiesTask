//error handler middleware
import { ApiError } from "../util/apiError";
import { NextFunction, Request, Response } from "express";

export const errorHandler = async (error: unknown, _: Request, res: Response, next: NextFunction) => { // eslint-disable-line
    console.error((error as Error).message);
    console.error(error);
    if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
        next();
    }

    res.status(500).json({ message: (error as Error).message })
    
    next();
}