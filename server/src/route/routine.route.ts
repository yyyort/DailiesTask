import { Router } from "express";
import { routineCreateController, routineDeleteController, routineGetallController, routineGetallHeadersController, routineGetController, routineUpdateController } from "../controller/routine.controller";
import { authValidator } from "../middleware/authValidator";
import { schemaValidator } from "../middleware/schemaValidator";
import { RoutineAddSchema, RoutineUpdateSchema } from "../model/routine.model";

const router =  Router();

router.get('/routine', authValidator, routineGetallController);
router.get('/routine/headers', authValidator, routineGetallHeadersController);
router.get('/routine/:id', authValidator, routineGetController);
router.post('/routine', authValidator, schemaValidator(RoutineAddSchema), routineCreateController);
router.put('/routine/:id', authValidator, schemaValidator(RoutineUpdateSchema), routineUpdateController);
router.delete('/routine/:id', authValidator, routineDeleteController);

export default router;