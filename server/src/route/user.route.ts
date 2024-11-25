import { Router } from "express";
import { userDeleteController, userGetController, userSignInController, userSignUpController, userUpdateController } from "../controller/user.controller";
import { schemaValidator } from "../middleware/schemaValidator";
import { UserCreateSchema, UserSignInSchema } from "../model/user.model";
import { authValidator } from "../middleware/authValidator";

const router = Router();

router.post('/user/signup', schemaValidator(UserCreateSchema), userSignUpController);
router.post('/user/signin', schemaValidator(UserSignInSchema), userSignInController);

router.get('/user/:id', authValidator, userGetController);
router.put('/user/:id', authValidator, userUpdateController);
router.delete('/user/:id', authValidator, userDeleteController);

export default router;