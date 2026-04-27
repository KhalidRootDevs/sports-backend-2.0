import { Router } from "express";

import { authenticate, authorizeRoles } from "../../middlewares/authenticate";
// import * as userController from './controller';
import { UserRole } from "./model";
import {
  changeUserPassword,
  deleteUserProfile,
  forgotPassword,
  getAllUsers,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
  updateUserProfile
} from "./controller";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/refresh", refreshToken);

// Protected routes (require authentication)
router.use(authenticate);

router.post("/logout", logoutUser);
router.get("/me", getUserProfile);
router.put("/profile", updateUserProfile);
router.post("/change-password", changeUserPassword);
router.delete("/profile", deleteUserProfile);

router.get("/all", authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]), getAllUsers);

export default router;
