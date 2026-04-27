import { Router } from "express";
import { getManageSettingsForMobile } from "./controller";
import { handleRequest } from "../../utils/helper";

const router = Router();

router.get("/", handleRequest(getManageSettingsForMobile));

export default router;
