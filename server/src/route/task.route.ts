import { Router } from "express";
import { taskCreateController, taskDeleteController, taskGetAllController, taskGetController, taskGetEverythingController, taskUpdateController, taskUpdateStatusController } from "../controller/task.controller";
import { authValidator } from "../middleware/authValidator";
import { schemaValidator } from "../middleware/schemaValidator";
import { TaskCreateSchema, TaskUpdateSchema } from "../model/task.model";

const router =  Router();

//task today
router.get('/task/everything', authValidator, taskGetEverythingController);

router.get('/task/:id', authValidator, taskGetController);
router.get('/task', authValidator, taskGetAllController);
router.post('/task', authValidator, schemaValidator(TaskCreateSchema), taskCreateController);
router.patch('/task/status/:id', authValidator, taskUpdateStatusController);
router.put('/task/:id', authValidator, schemaValidator(TaskUpdateSchema), taskUpdateController);

router.delete('/task/:id', authValidator, taskDeleteController);


export default router;
