import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  //   res.status(200).json({
  //     success: true,
  //     message: "Register User",
  //   });
  // Get User Details from frontend
  // Validation that not empty
  // Check if User Already Exists : UserName, Email
  // Check For Avatar And Image
  // Upload Them To Cloudinary
  // Create User Object - Create Entry In DB
  // Remove Password And Refresh Token From Field Of Response
  //  Check For User Creation
  // Check For Response
  // Data From Json Or Form We Can Get Directly Through Req.body
  const { fullName, email, username, password } = req.body;
  console.log(req.body);
});

export { registerUser };
