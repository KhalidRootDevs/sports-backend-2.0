import { Router } from "express";
import { verifyProxyApi } from "../middlewares/authenticate";
import { redisCachingMiddleware } from "../services/redis";
import { monksFootballV3Data, monksFootballV4Data, rapidApiFootballV3Data } from "../services/sports-proxy";

const router = Router();

router.use(verifyProxyApi);
router.use("/monk/v3/*", redisCachingMiddleware(), monksFootballV3Data);
router.use("/monk/v4/*", redisCachingMiddleware(), monksFootballV4Data);
router.use("/rapid/v3/*", redisCachingMiddleware(), rapidApiFootballV3Data);

export default router;
