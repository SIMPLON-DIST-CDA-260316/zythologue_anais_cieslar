import {Router} from 'express';
import {createUser} from '../controllers/userController.js';
import {createUserSchema} from "../validation/userValidation.js";
import {validate} from "../validation/validate.js";


const router = Router();

router.post("/register", validate(createUserSchema), createUser);

export default router;