import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/authenticate";
import {
  createHighlight,
  deleteAllHighlights,
  deleteHighlight,
  getAllHighlights,
  getHighlightById,
  updateHighlight
} from "./controller";
import { UserRole } from "../user/model";

const router = Router();

// Create a new highlight
router.post("/create", authenticate, createHighlight);

// Get all highlights
router.get("/all", authenticate, getAllHighlights);

// Get a single highlight by ID
router.get("/find/:id", authenticate, getHighlightById);

// Update a highlight by ID
router.put("/update/:id", authenticate, updateHighlight);

// Delete a highlight by ID
router.delete("/delete/:id", authenticate, deleteHighlight);

router.delete("/delete-all", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), deleteAllHighlights);

export default router;
