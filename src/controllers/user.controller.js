import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Generate Access And Refresh Token
const generateAccessAndRefreshTokens = async (userId) => {
  // Access Token
  try {
    // Try Thing
    const user = await User.findId(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // Adding Value To Object
    user.refreshToken = refreshToken;
    // Save In DB For That Save Query

    await user.save({ validateBeforeSave: False });
    // Return Both Token
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something Went Wrong While Generating Access And Refresh Token"
    );
  }
};

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
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.files);

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
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, "User With Username Or Email Is Exists");
  }
  // Multer Getting File Local Path
  // console.log(req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    // Optional Check
    // coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    // Mandate Check
    coverImageLocalPath = req.files.coverImage[0].path;
  }
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
    avatar: avatar.url,
    email,
    username: username.toLowerCase(),
    password,
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

const loginUser = asyncHandler(async (req, res, next) => {
  // Login User Logic
  // Req.body -> Data
  // Username Or Email
  // Find The User
  // Check Password
  // Access And Refresh Token
  // Send In Secure Cookies

  // Data From Req.body
  const { email, username, password } = req.body;
  if (!email || !username) {
    throw new ApiError(400, "Email or Username is required");
  }
  // Find Username Or Email Whatever Is Exist
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  //  If Both Are Not There Than User Not Exist
  if (!user) {
    throw new ApiError(404, "User Not Found Kindly  Register First");
  }
  //   await User;   Wrong User Is Object Of Mongoose -> In DB Stored As user
  // Password Is Matching Or Not
  // Our Method And MongoDB Function Accessible Through user
  // Mongoose Methods Are Accessible Through User
  // User -> Mongoose Ka Object
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }
  // Access And Refresh Token Extracting Value From Function
  // Basically Destructuring And Method Calling
  // Get Access And Refresh Token From Function Above
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // Two Ways Either We Update Old One Object Or One More DB Query
  // user.refreshToken = refreshToken;
  // await user.save({ validateBeforeSave: False });
  // Secure Cookies
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // Sending Cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  // Return Cookie
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      200,
      { user: loggedInUser, accessToken, refreshToken },
      "User Logged In Successfully"
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // Logout User
  // Cookies Clear
  // Access Token And Refresh Token Clear
});
export { registerUser, loginUser };
