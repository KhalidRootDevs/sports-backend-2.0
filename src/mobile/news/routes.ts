import { Router } from "express";
import { getNewsForMobile } from "./controller";
import { handleRequest } from "../../utils/helper";

const router = Router();

router.get("/", handleRequest(getNewsForMobile));

export default router;
