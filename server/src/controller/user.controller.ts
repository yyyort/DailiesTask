
import { Request, Response } from "express";
import { userCreateService, userDeleteService, userGetService, userSignInService, userUpdateService } from "../service/user.service";
import { UserCreateType, UserReturnType } from "../model/user.model";
import { ApiError } from "../util/apiError";
import jwt from 'jsonwebtoken';

/* 
    user sign up
*/
export const userSignUpController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, confirmPassword } = req.body;

        const reqBody: UserCreateType = { email, password, confirmPassword };

        const user: UserReturnType = await userCreateService(reqBody);

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET! as string,
            { expiresIn: '15m' });

        const refreshToken = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.REFRESH_TOKEN_SECRET! as string, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        res.status(201).json({ message: "User created successfully", user: user, accessToken: accessToken });
    } catch (error: unknown) {
        console.log(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message, error: error.error });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};

/* 
    user sign in
*/
export const userSignInController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await userSignInService({ email, password });

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET! as string,
            { expiresIn: '15m' });

        const refreshToken = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.REFRESH_TOKEN_SECRET! as string, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        res.status(200).json({ message: "User signed in successfully", user: user, accessToken: accessToken });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};


/* 
    user get
*/
export const userGetController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await userGetService(id);

        res.status(200).json({ message: "User retrieved successfully", user: user });
    } catch (error: unknown) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};

/* 
    user update
*/
export const userUpdateController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;

        const data = { email, password };

        const user = await userUpdateService(id, data);

        res.status(200).json({ message: "User updated successfully", user: user });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }

    }
};

/* 
    delete user
*/
export const userDeleteController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await userDeleteService(id);

        res.status(200).json({ message: "User deleted successfully", user: user });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};