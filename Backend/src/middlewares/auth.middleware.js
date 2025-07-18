import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace(/^Bearer\s+/, "");

    // Check if token is missing
    if (!token) {
      throw new ApiError(401, "Unauthorized request: Token not provided");
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(
      token,
      `${process.env.ACCESS_TOKEN_SECRET}`.trim()
    );

    // Fetch user from database using decoded token's user ID
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // If user not found
    if (!user) {
      throw new ApiError(401, "Invalid Access Token: User not found");
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    // Handle invalid token or verification failure
    next(new ApiError(401, error.message || "Invalid Access Token"));
  }
});
