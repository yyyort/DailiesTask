import { taskTodayGetService } from "../service/taskToday.service";
import { ApiError } from "../util/apiError";
import { Request, Response } from "express";

export const taskTodayGetController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;

        const tasks = await taskTodayGetService(userId);

        res.status(200).json({ message: "Tasks retrieved successfully", tasks: tasks });

    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};