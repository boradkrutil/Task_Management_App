import express from 'express';
import { isAdminRoute, protectRoute } from '../middleware/authMiddleware.js';
import { activateUserProfile, changeUserPassword, deleteUserProfile, getNotificationsList, getTeamList, loginUser, logoutUser, markNotificationRead, registerUser, updateUserProfile } from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

userRouter.get("/get-team", protectRoute, isAdminRoute, getTeamList);
userRouter.get("/notifications", protectRoute, getNotificationsList);

userRouter.put("/profile", protectRoute, updateUserProfile);
userRouter.put("/read-noti", protectRoute, markNotificationRead);
userRouter.put("/change-password", protectRoute, changeUserPassword);

//   FOR ADMIN ONLY - ADMIN ROUTES
userRouter
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default userRouter