import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/authenticate";
import { createNews, deleteAllNews, deleteNews, getAllNews, getNewsById } from "./controller";
import { UserRole } from "../user/model";

const router = Router();

router.post("/create", authenticate, createNews);
router.get("/all", authenticate, getAllNews);
router.get("/find/:id", authenticate, getNewsById);
router.delete("/delete/:id", authenticate, deleteNews);
router.delete("/delete-all", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), deleteAllNews);

export default router;
