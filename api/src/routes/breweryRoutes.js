import {Router} from "express";
import {getBreweries} from "../controllers/breweryController.js";

const router = Router();

router.get("/", getBreweries);

export default router;