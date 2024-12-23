import { Router } from "express";
import { contributionCreateController } from "../controller/contribution.controller";
import { authValidator } from "../middleware/authValidator";

const router = Router();

router.get("/contributions", authValidator, contributionCreateController);

export default router;