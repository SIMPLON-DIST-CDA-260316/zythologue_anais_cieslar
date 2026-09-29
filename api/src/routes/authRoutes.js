import {Router} from 'express';
import {createUser, loginUser} from '../controllers/userController.js';
import {createUserSchema, loginSchema} from "../validation/userValidation.js";
import {validate} from "../validation/validate.js";


const router = Router();

router.post("/register", validate(createUserSchema), createUser);
router.post("/login", validate(loginSchema), loginUser)

export default router;