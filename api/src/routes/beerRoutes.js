import { Router } from "express";
import { getBeers, getOneBeer, createBeer, modifyBeer, removeBeer } from "../controllers/beerController.js";

const router = Router();

router.get("/", getBeers);
router.get("/:id", getOneBeer);
router.post("/", createBeer);
router.patch("/:id", modifyBeer);
router.delete("/:id", removeBeer);

export default router;