import { Router } from "express";
import { getStreamingSourcesForMobile } from "./controller";
import { handleRequest } from "../../utils/helper";

const router = Router();

router.get("/:matchId", handleRequest(getStreamingSourcesForMobile));

export default router;
