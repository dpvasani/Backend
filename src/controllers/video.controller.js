import { asyncHandler } from "../utils/asyncHandler.js"; // helper file and its higher order func
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";

////////// Get all videos //////////
// 1. Get the page, limit, query, sortBy, sortType, userId from the request query(frontend) [http://localhost:8000/api/v1/video/all-video?page=1&limit=10&query=hello&sortBy=createdAt&sortType=1&userId=123]
// 2. Get all videos based on query, sort, pagination)
// 2.1 match the videos based on title and description
// 2.2 match the videos based on userId=Owner
// 3. lookup the Owner field of video and get the user details
// 4. addFields just add the Owner field to the video document
// 5. set options for pagination
// 6. get the videos based on pipeline and options
const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination)
  // 1. Get the page, limit, query, sortBy, sortType, userId from the request query(frontend) [http://localhost:8000/api/v1/video/all-video?page=1&limit=10&query=hello&sortBy=createdAt&sortType=1&userId=123]
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = 1,
    userId = "",
  } = req.query;

  // 2. Get all videos based on query, sort, pagination)
  let pipeline = [
    {
      $match: {
        $and: [
          {
            // 2.1 match the videos based on title and description
            $or: [
              { title: { $regex: query, $options: "i" } }, // $regex: is used to search the string in the title "this is first video" => "first"  // i is for case-insensitive
              { description: { $regex: query, $options: "i" } },
            ],
          },
          // 2.2 match the videos based on userId=Owner
          ...(userId ? [{ Owner: new mongoose.Types.ObjectId(userId) }] : ""), // if userId is present then match the Owner field of video
          // new mongoose.Types.ObjectId( userId ) => convert userId to ObjectId
        ],
      },
    },
    // 3. lookup the Owner field of video and get the user details
    {
      // from user it match the _id of user with Owner field of video and saved as Owner
      $lookup: {
        from: "users",
        localField: "Owner",
        foreignField: "_id",
        as: "Owner",
        pipeline: [
          // project the fields of user in Owner
          {
            $project: {
              _id: 1,
              fullName: 1,
              avatar: "$avatar.url",
              username: 1,
            },
          },
        ],
      },
    },
    {
      // 4. addFields just add the Owner field to the video document
      $addFields: {
        Owner: {
          $first: "$Owner", // $first: is used to get the first element of Owner array
        },
      },
    },
    {
      $sort: { [sortBy]: sortType }, // sort the videos based on sortBy and sortType
    },
  ];

  try {
    // 5. set options for pagination
    const options = {
      // options for pagination
      page: parseInt(page),
      limit: parseInt(limit),
      customLabels: {
        // custom labels for pagination
        totalDocs: "totalVideos",
        docs: "videos",
      },
    };

    // 6. get the videos based on pipeline and options
    const result = await Video.aggregatePaginate(
      Video.aggregate(pipeline),
      options
    ); // Video.aggregate( pipeline ) find the videos based on pipeline(query, sortBy, sortType, userId). // aggregatePaginate is used for pagination (page, limit)

    if (result?.videos?.length === 0) {
      return res.status(404).json(new ApiResponse(404, {}, "No Videos Found"));
    }

    // result contain all pipeline videos and pagination details
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Videos fetched successfully"));
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json(
        new ApiError(500, {}, "Internal server error in video aggregation")
      );
  }
});
//////////////////////////////////////////////////////////////////////

////////// Publish a video //////////
// 1. Get the video file and thumbnail from the request body(frontend)
// 2. upload video and thumbnail to local storage and get the path
// 3. upload video and thumbnail to cloudinary
// 4. create a video document in the database
const publishAVideo = asyncHandler(async (req, res) => {
  try {
    // 1. Get the video file and thumbnail from the request body(frontend)
    // TODO: get video, upload to cloudinary, create video
    const { title, description } = req.body;
    if ([title, description].some((field) => field.trim() === "")) {
      throw new ApiError(400, "Please provide all details");
    }

    // 2. upload video and thumbnail to local storage and get the path
    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!videoLocalPath) {
      throw new ApiError(400, "Please upload video");
    }
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Please upload thumbnail");
    }

    // 3. upload video and thumbnail to cloudinary
    const videoOnCloudinary = await uploadOnCloudinary(videoLocalPath, "video");
    const thumbnailOnCloudinary = await uploadOnCloudinary(
      thumbnailLocalPath,
      "img"
    );

    if (!videoOnCloudinary) {
      throw new ApiError(400, "video Uploading failed");
    }
    if (!thumbnailOnCloudinary) {
      throw new ApiError(400, "video Uploading failed");
    }

    // 4. create a video document in the database
    const video = await Video.create({
      title: title,
      description: description,
      thumbnail: thumbnailOnCloudinary?.url,
      videoFile: videoOnCloudinary?.url,
      duration: videoOnCloudinary?.duration,
      isPUblished: true,
      Owner: req.user?._id,
    });

    if (!video) {
      throw new ApiError(400, "video Uploading failed");
    }

    return res
      .status(200)
      .json(new ApiResponse(201, video, "Video Uploaded successfully"));
  } catch (error) {
    return res
      .status(501)
      .json(new ApiError(501, {}, "Problem in uploading video"));
  }
});
//////////////////////////////////////////////////////////////////////

////////// Get a video by id //////////
// 1. Get the video id from the request params(frontend)  [http://localhost:8000/api/v1/video/get-video/:videoId]
// 2. Check if the videoId id is valid
// 3. Find the video in the database
const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  try {
    // 1. Get the video id from the request params(frontend)  [http://localhost:8000/api/v1/video/get-video/:videoId]
    const { videoId } = req.params;

    // 2. Check if the videoId id is valid
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid VideoID");
    }

    // 3. Find the video in the database
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(400, "Failed to get Video details.");
    }

    return res.status(200).json(new ApiResponse(200, video, "Video found "));
  } catch (error) {
    res.status(501).json(new ApiError(501, {}, "Video not found"));
  }
});
//////////////////////////////////////////////////////////////////////

////////// Update a video //////////
// 1. Get the videoId from the request params(frontend)  [http://localhost:8000/api/v1/video/update-video/:videoId]
// 2. Get the title, description from the request body(frontend)
// 3. Find the video in the database by videoId
// 3.3 Check if the video is owned by the user [video.Owner.equals(req.user._id)] only owner can update the video
// 4. Get the thumbnail from the request body(frontend) and upload it to cloudinary
// 5. delete the old thumbnail from cloudinary
// 6. update the video details like title, description, thumbnail in the database
const updateVideo = asyncHandler(async (req, res) => {
  try {
    //TODO: update video details like title, description, thumbnail

    // 1. Get the videoId from the request params(frontend)  [http://localhost:8000/api/v1/video/update-video/:videoId]
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid VideoID");
    }

    // 2. Get the title, description, thumbnail from the request body(frontend)
    const { title, description } = req.body;
    if ([title, description].some((field) => field.trim() === "")) {
      throw new ApiError(400, "Please provide title, description, thumbnail");
    }

    // 3. Find the video in the database by videoId
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(400, "Video not found");
    }

    // 3.3 Check if the video is owned by the user [video.Owner.equals(req.user._id)] only owner can update the video
    if (!video.Owner.equals(req.user._id)) {
      throw new ApiError(400, {}, "You cant update this video");
    }

    // 4. Get the thumbnail from the request body(frontend) and upload it to cloudinary
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "thumbnail not found");
    }

    const thumbnailOnCloudinary = await uploadOnCloudinary(
      thumbnailLocalPath,
      "img"
    );
    if (!thumbnailOnCloudinary) {
      throw new ApiError(400, "thumbnail not uploaded on cloudinary");
    }

    // 5. delete the old thumbnail from cloudinary
    const thumbnailOldUrl = video?.thumbnail;
    const deleteThumbnailOldUrl = await deleteFromCloudinary(
      thumbnailOldUrl,
      "img"
    );
    if (!deleteThumbnailOldUrl) {
      throw new ApiError(400, "thumbnail not deleted");
    }

    // 6. update the video details like title, description, thumbnail in the database
    video.title = title;
    video.description = description;
    video.thumbnail = thumbnailOnCloudinary.url;
    await video.save();

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video details updated successfully"));
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json(new ApiError(500, {}, "video not updated"));
  }
});

//////////////////////////////////////////////////////////////////////

////////// Delete a video //////////
// 1. Get the videoId from the request params(frontend)  [http://localhost:8000/api/v1/video/delete-video/:videoId]
// 2. find the video in the database by videoId and delete it
// 2.2. Check if the video is owned by the user [video.Owner.equals(req.user._id)] only owner can delete the video
// 3. delete the videoFile and thumbnail from cloudinary
// 4. Delete the video document from the database
const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  // 1. Get the videoId from the request params(frontend)  [http://localhost:8000/api/v1/video/delete-video/:videoId]
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid VideoID");
  }

  // 2. find the video in the database by videoId and delete it
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Invalid Video");
  }

  // 2.2. Check if the video is owned by the user [video.Owner.equals(req.user._id)] only owner can delete the video
  if (!video.Owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  // 3. delete the videoFile and thumbnail from cloudinary
  const videoFile = await deleteFromCloudinary(video.videoFile, "video");
  const thumbnail = await deleteFromCloudinary(video.thumbnail, "img");

  if (!videoFile && !thumbnail) {
    throw new ApiError(
      400,
      "thumbnail or videoFile is not deleted from cloudinary"
    );
  }

  // 4. Delete the video document from the database
  await video.remove(); // .remove don't worked with findOne it only works with findById

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Deleted successfully"));
});
//////////////////////////////////////////////////////////////////////

////////// Toggle publish status of a video //////////
// 1. Get the videoId from the request params(frontend)  [http://localhost:8000/api/v1/video/toggle/:videoId]
// 2. findById the video in the database by videoId and check if the video is owned by the user
// 3. toggle the isPUblished field of the video document
const togglePublishStatus = asyncHandler(async (req, res) => {
  // 1. Get the videoId from the request params(frontend)  [http://localhost:8000/api/v1/video/toggle/:videoId]
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid VideoID");
  }

  // 2. findById the video in the database by videoId and check if the video is owned by the user
  const toggleIsPublished = await Video.findOne(
    // findOne will check _id AND Owner both should match  // dont use findById it only check _id
    {
      _id: videoId, // The document must have this _id (videoId)
      Owner: req.user._id, // The Owner field must match req.user._id
    }
  );

  if (!toggleIsPublished) {
    throw new ApiError(400, "Invalid Video or Owner");
  }

  // 3. toggle the isPUblished field of the video document
  toggleIsPublished.isPUblished = !toggleIsPublished.isPUblished;

  await toggleIsPublished.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        toggleIsPublished.isPUblished,
        "isPUblished toggled successfully"
      )
    );
});
//////////////////////////////////////////////////////////////////////

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
