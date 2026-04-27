import { Router } from "express";
import { getLiveMatchesForMobile } from "./controller";
import { handleRequest } from "../../utils/helper";

const router = Router();

router.get("/", handleRequest(getLiveMatchesForMobile));

export default router;
