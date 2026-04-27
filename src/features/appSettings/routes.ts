import { Router } from "express";

import { authenticate, authorizeRoles } from "../../middlewares/authenticate";
import { UserRole } from "../user/model";
import { getSettings, resetSettings, updateSettings } from "./controller";

const router = Router();

// Public route to get settings
router.get("/find", authenticate, authorizeRoles([UserRole.ADMIN]), getSettings);

// Route to update settings - protected and requires admin role
router.put("/update", authenticate, authorizeRoles([UserRole.ADMIN]), updateSettings);

// Route to reset settings - protected and requires admin role
router.delete("/reset", authenticate, authorizeRoles([UserRole.ADMIN]), resetSettings);

export default router;
