import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { createAdsType, deleteAdsType, getAdsType, getAllAdsTypes, updateAdsType } from "./controller";

const router = Router();

// Create a new AdsType
router.post("/create", authenticate, createAdsType);

// Get all AdsTypes
router.get("/all", authenticate, getAllAdsTypes);

// Get a single AdsType by ID
router.get("/find/:id", authenticate, getAdsType);

// Update an AdsType by ID
router.put("/update/:id", authenticate, updateAdsType);

// Delete an AdsType by ID
router.delete("/delete/:id", authenticate, deleteAdsType);

export default router;
