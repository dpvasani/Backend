import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyJWT } from "./../middlewares/auth.middleware.js";

const router = Router();

// Route to handle user registration
// Jate Time Milke Jana
// Middlewares Has 2 - 3 Syntax
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
// router.route("/login").post(login);
// https::/localhost:8000/user/register

// Login Route
router.route("/login").post(loginUser);

// Secure Routes
router.route("/logout").post(verifyJWT, logoutUser);
export default router;
