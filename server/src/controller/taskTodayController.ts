import { TaskStatusType, TaskTodayReturnType } from "../model/task.model";
import { taskTodayGetService } from "../service/taskToday.service";
import { ApiError } from "../util/apiError";
import { Request, Response } from "express";

export const taskTodayGetController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const query = req.query;
        const filter = query.filter;

        console.log("filter", filter);
        console.log("query", query);

        if (filter) {
            const splitFilter: TaskStatusType[] = (filter as string).split(" ") as TaskStatusType[];

            const tasks: TaskTodayReturnType[] = await taskTodayGetService(userId, splitFilter);

            res.status(200).json({ message: "Tasks retrieved successfully", tasks: tasks });
        }
        else {
            const tasks: TaskTodayReturnType[] = await taskTodayGetService(userId);

            res.status(200).json({ message: "Tasks retrieved successfully", tasks: tasks });
        }

    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
};