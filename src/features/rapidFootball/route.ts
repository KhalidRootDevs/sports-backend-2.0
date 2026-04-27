import { Router } from "express";
import { getFixturesRapid } from "./controller";

const router = Router();

router.post("/fixtures/formatted", getFixturesRapid);

export default router;
