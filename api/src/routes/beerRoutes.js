import { Router } from "express";
import { findOneBeer, createBeer } from "../controllers/beerController.js";

const router = Router();

router.get("/:id", findOneBeer);
router.post("/", createBeer);

export default router;