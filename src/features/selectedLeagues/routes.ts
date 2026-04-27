import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middlewares/authenticate";
import {
  allSelectedLeagues,
  createSelectedLeague,
  deleteSelectedLeague,
  getAllSelectedLeagues,
  getSelectedLeagueById,
  searchLeagues,
  sortByPosition,
  updateSelectedLeague
} from "./controller";
import { UserRole } from "../user/model";

const router = Router();

router.get("/every", allSelectedLeagues);
router.patch("/sortBy", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), sortByPosition);
router.get("/all", getAllSelectedLeagues);
router.post("/create", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), createSelectedLeague);
router.get("/find/:id", authenticate, getSelectedLeagueById);
router.put("/update/:id", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), updateSelectedLeague);
router.delete("/delete/:id", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), deleteSelectedLeague);
router.get("/search", authenticate, authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), searchLeagues);

export default router;
