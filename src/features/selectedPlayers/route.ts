import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/authenticate";
import { UserRole } from "../user/model";
import {
  createPlayer,
  deletePlayer,
  getAllPlayers,
  getPlayerById,
  searchPlayers,
  sortPlayers,
  updatePlayer
} from "./controller";

const router = Router();

router.get("/every", getAllPlayers);
router.patch("/sortBy", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), sortPlayers);
router.get("/all", getAllPlayers);
router.post("/create", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), createPlayer);
router.get("/find/:id", authenticate, getPlayerById);
router.put("/update/:id", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), updatePlayer);
router.delete("/delete/:id", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), deletePlayer);

router.get("/search", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), searchPlayers);

export default router;
