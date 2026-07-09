import { Router } from "express";
import { getOneBeer } from "../controllers/beerController.js";

const router = Router();

router.get("/:id", getOneBeer);

export default router;