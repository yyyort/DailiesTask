import { Router } from "express";
import { schemaValidator } from "../middleware/schemaValidator";

import { userRevalidateTokenController, userSignUpController } from "../controller/auth.controller";
import { UserCreateSchema } from "@workspace/types";

const router: Router = Router();

//unprotected routes
router.post('/signup', schemaValidator(UserCreateSchema), userSignUpController);
/* router.post('/user/signin', schemaValidator(UserSignInSchema), userSignInController); */
router.get('/revalidate', userRevalidateTokenController);


export default router;