import { Response, Request } from "express"
import { RoutineCreateType, RoutineReturnType, RoutineUpdateType } from "../model/routine.model";
import { routineCreateService, routineDeleteService, routineGetAllHeaders, routineGetAllService, routineGetService, routineUpdateService } from "../service/routine.service";

/* 
    GET all
*/
export const routineGetallController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const filters = req.query.filter as string;

        console.log("in contoller", filters);

        if (filters) {
            const filtersArray = filters.split('-');

            //get all routines with filters
            const routines: RoutineReturnType[] = await routineGetAllService(userId, filtersArray);

            res.status(200).json({ message: "Routines retrieved successfully", routines: routines });
        }

        //get all routines
        const routines: RoutineReturnType[] = await routineGetAllService(userId);

        res.status(200).json({ message: "Routines retrieved successfully", routines: routines });
    } catch (error) {
        console.error(error);
    }
}


/* 
    GET all
*/
export const routineGetallHeadersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;

        //get all routines
        const routines: {
            id: string,
            title: string,
        }[] = await routineGetAllHeaders(userId);

        res.status(200).json({ message: "Routines retrieved successfully", routines: routines });
    } catch (error) {
        console.error(error);
    }
}


/* 
    GET
*/
export const routineGetController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const id = req.params.id;

        //get a specific routine
        const routine: RoutineReturnType = await routineGetService(userId, id);

        res.status(200).json({ message: "Routine retrieved successfully", routine: routine });
    } catch (error) {
        console.error(error);
    }
}


/* 
    POST
*/
export const routineCreateController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const { title, description, tasks } = req.body;

        const data: RoutineCreateType = {
            title,
            description,
            tasks
        }

        //create routine
        const routine: RoutineReturnType = await routineCreateService(userId, data);

        res.status(201).json({ message: "Routine created successfully", routine: routine });
    } catch (error) {
        console.error(error);
    }
}

/* 
    PUT 
*/
export const routineUpdateController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const id = req.params.id;

        const { title, description, tasks } = req.body;

        const data: RoutineUpdateType = {
            title,
            description,
            tasks
        }

        //update routine
        const routine: RoutineReturnType = await routineUpdateService(userId, id, data);

        res.status(200).json({
            message: "Routine updated successfully", routine: {
                id: id,
                title: routine.title,
                description: routine.description
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/* 
    DELETE
*/
export const routineDeleteController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const id = req.params.id;

        //delete routine
        await routineDeleteService(userId, id);

        res.status(200).json({ message: "Routine deleted successfully" });

    } catch (error) {
        console.error(error);
    }
}