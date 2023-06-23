const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getUserDetailsAdmin,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const {
  isUserAuthenticated,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/password/forgot").post(forgotPassword);

userRouter.route("/password/reset/:token").put(resetPassword);

userRouter.route("/logout").get(logoutUser);

userRouter.route("/me").get(isUserAuthenticated, getUserDetails);

userRouter.route("/password/update").put(isUserAuthenticated, updatePassword);

userRouter.route("/me/update").put(isUserAuthenticated, updateProfile);

userRouter
  .route("/admin/users")
  .get(isUserAuthenticated, authorizeRoles("Admin"), getAllUsers);

userRouter
  .route("/admin/user/:id")
  .get(isUserAuthenticated, authorizeRoles("Admin"), getUserDetailsAdmin)
  .put(isUserAuthenticated, authorizeRoles("Admin"), updateUserRole)
  .delete(isUserAuthenticated, authorizeRoles("Admin"), deleteUser);

module.exports = userRouter;
