import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Generate Access And Refresh Token Method When You Call This Function You Will Get Access And Refresh Token
const generateAccessAndRefreshTokens = async (userId) => {
  // Access Token
  try {
    // Try Thing
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // Adding Value To Object
    user.refreshToken = refreshToken;
    // Save In DB For That Save Query

    await user.save({ validateBeforeSave: false });
    // Return Both Token
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateAccessAndRefreshTokens:", error);
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
  if (!(email || username)) {
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
  // Sending Cookies Options -> Object
  const options = {
    httpOnly: true, // Modified By Server Only
    // Client Can View
    secure: true,
  };
  // Return Cookie
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          // So User Can Store Their Data On Local Storage
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // Logout User
  // Cookies Clear
  // Access Token And Refresh Token Clear
  //   req.user._id;
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  // Clear Cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Refresh Access Token
  // Get Refresh Token From Cookies
  // Check If Refresh Token Is There
  // Verify Refresh Token
  // Generate New Access Token
  // Send New Access Token
  // Get Refresh Token From Cookies
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    // Decode Token In DB Actual Token Is Stored But In User Encrypted Token Is Gone
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      `${process.env.REFRESH_TOKEN_SECRET}`
    );
    // Refresh Token Has _ID
    const user = await User.findById(decodedToken?._id);
    // User Is Not Found Than Token Is Invalid
    // Because Every Token Associated With Id
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    // Incoming == Saved In DB
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token Is Expired Or Used");
    }
    // Option For Sending In Cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // Change Password
  // Check Current Password
  // Update Password
  // Send Response
  // Data From Request
  const { oldPassword, newPassword } = req.body;
  // Find User
  const user = await User.findById(req.user._id);
  // Check Password
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Password");
  }
  // Update Password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, {}, "Password Changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // Get Current User
  // Get User From Request
  // Send Response
  // Data From Request
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetched Successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  // Update Account Details
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All Fields Are Required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated Successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  // Update User Avatar
  // Check If Avatar Is There
  // Upload Avatar To Cloudinary
  // Update User Avatar
  // Send Response
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error While Uploading On Avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Image Updated Successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  //TODO: delete old image - assignment

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // Get User Channel Profile
  // Get User Id From Request
  // Find User
  // Send Response
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "Username Is Missing");
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            // Check If Available In Array Or Oject
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel Does Not Exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User Channel Fetched Successfully")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};
