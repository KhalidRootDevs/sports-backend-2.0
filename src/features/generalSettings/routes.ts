import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { createOrUpdateGeneralSettings, getGeneralSettings, resetGeneralSettings } from "./controller";

const router = Router();

// Create or update GeneralSettings
router.post("/update", authenticate, createOrUpdateGeneralSettings);

// Get GeneralSettings
router.get("/get", authenticate, getGeneralSettings);

// Reset (delete) GeneralSettings
router.delete("/reset", authenticate, resetGeneralSettings);

export default router;
