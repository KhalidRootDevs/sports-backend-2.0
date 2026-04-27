import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/authenticate";
import { UserRole } from "../user/model";
import { getStreamingSources, updateStreamingSourcesOrder } from "./controller";

const router = Router();

// Route to get all live matches
router.get("/find/:matchId", getStreamingSources);

// Sort streaming sources
router.patch("/sort", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), updateStreamingSourcesOrder);

export default router;
