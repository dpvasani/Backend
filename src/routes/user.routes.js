import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";

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

export default router;
