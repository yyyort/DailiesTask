import { Request, Response } from "express";
import { ApiError } from "../util/apiError";
import { taskCreateService, taskDeleteService, taskGetAllService, taskGetEverythingService, taskGetService, taskUpdateService, taskUpdateStatusService } from "../service/task.service";
import { TaskCreateType, TaskUpdateType } from "../model/task.model";

//read
export const taskGetController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;

        const task = await taskGetService(userId, Number(id));

        res.status(200).json({ message: "Task retrieved successfully", task: task });
    } catch (error: unknown) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
}

//get all tasks of a user
export const taskGetAllController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const date = req.query.date;

        //check date correct format
        /*  if (date && typeof date === 'string' && !date.match(/^\d{2}-\d{2}-\d{4}$/)) {
             console.error("Date format is incorrect");
             throw new ApiError(400, "Date format is incorrect", {});
         }
  */
        console.log('in task get', date?.toString());

        const tasks = await taskGetAllService(userId, date as string);

        res.status(200).json({ message: "Tasks retrieved successfully", tasks: tasks });
    } catch (error: unknown) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
}


//get every task of a user
export const taskGetEverythingController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;

        const tasks = await taskGetEverythingService(userId);

        res.status(200).json({ message: "Tasks retrieved successfully", tasks: tasks });
    } catch (error: unknown) {
        console.error((error as Error).message);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
}


//create
export const taskCreateController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, status, timeToDo, deadline } = req.body;
        const userId = req.body.userId;

        const data: TaskCreateType = {
            title,
            description,
            status,
            timeToDo,
            deadline
        };

        const task = await taskCreateService(userId, data);

        res.status(201).json({ message: "Task created successfully", task: task });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
}

//update
export const taskUpdateController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status, timeToDo, deadline } = req.body;
        const userId = req.body.userId;

        if (!title && !description && !status && !timeToDo && !deadline) {
            console.error("No data provided to update");
            throw new ApiError(400, "No data provided to update", {
                title: "Title is required",
                description: "Description is required",
                status: "Status is required",
                timeToDo: "Time to do is required",
                deadline: "Deadline is required"
            });
        }

        const data: TaskUpdateType = {
            title,
            description,
            status,
            timeToDo,
            deadline
        };

        const task = await taskUpdateService(userId, Number(id), data);

        res.status(200).json({ message: "Task updated successfully", task: task });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message, err: error });
        }

    }
}

//update status
export const taskUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            console.error("No status provided to update");
            throw new ApiError(400, "No status provided to update", {});
        }

        const task = await taskUpdateStatusService(req.body.userId, Number(id), status);

        res.status(200).json({ message: "Task status updated successfully", task: task });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
}

//delete
export const taskDeleteController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;

        const task = await taskDeleteService(userId, Number(id));

        res.status(200).json({ message: "Task deleted successfully", task: task });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof ApiError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
        }
    }
}