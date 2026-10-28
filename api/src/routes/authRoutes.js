import {Router} from 'express';
import {createUser, getMe, loginUser} from '../controllers/userController.js';
import {createUserSchema, loginSchema} from "../validation/userValidation.js";
import {validate} from "../validation/validate.js";
import {authenticate} from "../middlewares/auth.js";


const router = Router();

router.post("/register", validate(createUserSchema), createUser);
router.post("/login", validate(loginSchema), loginUser)
router.get("/me", authenticate, getMe);

export default router;