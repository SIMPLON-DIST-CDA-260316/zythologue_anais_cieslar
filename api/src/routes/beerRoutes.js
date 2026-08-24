import { Router } from "express";
import { findOneBeer, createBeer, modifyBeer, removeBeer } from "../controllers/beerController.js";

const router = Router();

router.get("/:id", findOneBeer);
router.post("/", createBeer);
router.patch("/:id", modifyBeer);
router.delete("/:id", removeBeer);

export default router;