import { Router } from "express";
import { findOneBeer, createBeer, modifyBeer } from "../controllers/beerController.js";

const router = Router();

router.get("/:id", findOneBeer);
router.post("/", createBeer);
router.patch("/:id", modifyBeer);

export default router;