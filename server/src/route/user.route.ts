import { Router } from "express";
import { userDeleteController, userGetController, userLogoutController, userRevalidateTokenController, userSignInController, userSignUpController, userUpdateController } from "../controller/user.controller";
import { schemaValidator } from "../middleware/schemaValidator";
import { UserCreateSchema, UserSignInSchema } from "../model/user.model";
import { authValidator } from "../middleware/authValidator";

const router = Router();

//unprotected routes
router.post('/user/signup', schemaValidator(UserCreateSchema), userSignUpController);
router.post('/user/signin', schemaValidator(UserSignInSchema), userSignInController);
router.post('/user/revalidate', userRevalidateTokenController);

//protected routes
router.get('/user/:id', authValidator, userGetController);
router.put('/user/:id', authValidator, userUpdateController);
router.delete('/user/:id', authValidator, userDeleteController);
router.post('/user/logout', authValidator, userLogoutController);

export default router;