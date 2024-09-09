import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //   res.status(200).json({
  //     success: true,
  //     message: "Register User",
  //   });
  // Get User Details from frontend
  // Validation that not empty
  // Check if User Already Exists : UserName, Email
  // Check For Avatar And Image
  // Upload Them To Cloudinary Avatar
  // Create User Object - Create Entry In DB
  // Remove Password And Refresh Token From Field Of Response
  // Check For User Creation
  // Check For Response
  // Data From Json Or Form We Can Get Directly Through Req.body
  const { fullName, email, username, password } = req.body;
  console.log(req.body);

  // Validation
  // In Production Level There Is Separate File For This
  //   if (fullName === "") {
  //     throw new ApiError(400, "Full Name is required");
  //   }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // Check If User Name Is Exists
  const existedUser = User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, "User With Username Or Email Is Exists");
  }
  // Multer Getting File Local Path
  // console.log(req.files)
  const AvatarLocalPath = req.files?.avatar[0].path;
  const CoverImageLocalPath = req.files?.coverImage[0].path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File Is Required");
  }
  // Cloudinary Uploading
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar File Is Required");
  }
  // Creating User And Entry In DB
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "User Not Created");
  }
  // Response
  return res.status(201).json(
    new ApiResponse(
      200,
      {
        user: createdUser,
      },
      "User Registered Successfully"
    )
  );
});

export { registerUser };
