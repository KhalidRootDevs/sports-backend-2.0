import { Router } from "express";
import { getHighlightsForMobile, getHighlightByIdForMobile } from "./controller";
import { handleRequest } from "../../utils/helper";

const router = Router();

router.get("/", handleRequest(getHighlightsForMobile));
router.get("/:id", handleRequest(getHighlightByIdForMobile));

export default router;
