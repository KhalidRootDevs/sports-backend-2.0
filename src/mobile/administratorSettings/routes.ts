import { Router } from "express";
import { getAdministratorSettingsForMobile } from "./controller";
import { handleRequest } from "../../utils/helper";

const router = Router();

router.get("/", handleRequest(getAdministratorSettingsForMobile));

export default router;
