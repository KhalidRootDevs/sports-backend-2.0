import { Router } from "express";
import { createContactUsForMobile } from "./controller";
import { handleRequest } from "../../utils/helper";

const router = Router();

router.post("/", handleRequest(createContactUsForMobile));

export default router;
