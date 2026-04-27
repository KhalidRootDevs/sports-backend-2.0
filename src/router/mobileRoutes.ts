import { Request, Response, Router } from "express";
import { verifyMobileApi } from "../middlewares/authenticate";
import { redisCachingMiddleware } from "../services/redis";
import contactUsRoutes from "../mobile/contactUs/routes";
import newsRoutes from "../mobile/news/routes";
import administratorSettingsRoute from "../mobile/administratorSettings/routes";
import manageSettings from "../mobile/manageSettings/routes";
import liveMatchRoutes from "../mobile/live-match/routes";
import streamingSources from "../mobile/streamingSources/routes";
import highlightsRoutes from "../mobile/highlights/routes";

const router = Router();

router.use(verifyMobileApi);

router.get("/geo/client-ip", (req: Request, res: Response) => {
  res.json({ ip: req.userIp });
});

router.use("/contact/help", contactUsRoutes);
router.use("/feed/news-updates", newsRoutes);
router.use("/dashboard/admin-config", administratorSettingsRoute);
router.use("/profile/user-config", manageSettings);
router.use("/video/highlights", highlightsRoutes);
router.use("/matches/live-fixtures", redisCachingMiddleware(), liveMatchRoutes);
router.use("/video/stream-sources", redisCachingMiddleware(), streamingSources);

export default router;
