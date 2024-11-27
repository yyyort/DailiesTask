import { Router } from "express";
import { taskCreateController, taskDeleteController, taskGetAllController, taskGetController, taskUpdateController } from "../controller/task.controller";
import { authValidator } from "../middleware/authValidator";

const router =  Router();

router.get('/task/:id', authValidator, taskGetController);
router.get('/task', authValidator, taskGetAllController);
router.post('/task', authValidator, taskCreateController);
router.put('/task/:id', authValidator, taskUpdateController);
router.delete('/task/:id', authValidator, taskDeleteController);

export default router;
