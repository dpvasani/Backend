import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";

////////////////////// Get the channel stats like total video views, total subsvideos, total likes etc. ///////////////////////
// TODO: Get the channel stats like total video views, total subsvideos, total likes etc.
// total views, total videos, total subscribers, total likes, total tweets, total comments
// 1. get channel from req.body or req.params
// 2. find the channel using the username and get the channelID
// 3. aggregate the total views and total videos
// 4. aggregate the total subscribers
// 5. aggregate the total tweets
// 6. aggregate the total comments
// 7. aggregate the total video likes
// 8. aggregate the total comment likes
const getChannelStats = asyncHandler(async (req, res) => {
  // 1. get channel from req.body or req.params
  let { channel } = req.body;
  // const {channelID} = req.params

  // 2. find the channel using the username and get the channelID
  channel = await User.findOne({ username: channel });
  if (!channel) {
    throw new ApiError(400, "Channel not found!");
  }

  const channelID = new mongoose.Types.ObjectId(channel?._id);

  if (!isValidObjectId(channelID)) {
    throw new ApiError(400, "channel not found");
  }

  // 3. aggregate the total views and total videos
  const totalViewsAndVideos = await Video.aggregate([
    {
      $match: {
        $and: [
          { Owner: new mongoose.Types.ObjectId(channelID) },
          { isPUblished: true },
        ],
      },
    },
    {
      $group: {
        // Group the videos by Owner and calculate the total views and total videos
        _id: "$Owner",
        totalViews: { $sum: "$views" }, // Calculate the total views
        totalVideos: { $sum: 1 }, // Calculate the total videos (1 for each video)
      },
    },
  ]);

  // 4. aggregate the total subscribers
  const totalSubs = await Subscription.aggregate([
    { $match: { channel: new mongoose.Types.ObjectId(channelID) } },
    { $count: "totalSubscribers" }, // Count the total subscribers
  ]);

  // 5. aggregate the total tweets
  const totalTweets = await Tweet.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(channelID) } },
    { $count: "totalTweets" },
  ]);

  // 6. aggregate the total comments
  const totalComments = await Comment.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(channelID) } },
    { $count: "totalComments" },
  ]);

  // 7. aggregate the total video likes
  const totalVideoLikes = await Like.aggregate([
    {
      $match: {
        $and: [
          { likedBy: new mongoose.Types.ObjectId(channelID) },
          { video: { $exists: true } }, // Find the likes on videos
        ],
      },
    },
    { $count: "totalVideoLikes" },
  ]);

  // 8. aggregate the total comment likes
  const totalCommentLikes = await Like.aggregate([
    {
      $match: {
        $and: [
          { likedBy: new mongoose.Types.ObjectId(channelID) },
          { Comment: { $exists: true } },
        ],
      },
    },
    { $count: "totalCommentLikes" },
  ]);

  // 9. aggregate the total tweet likes
  const totalTweetLikes = await Like.aggregate([
    {
      $match: {
        $and: [
          { likedBy: new mongoose.Types.ObjectId(channelID) },
          { tweet: { $exists: true } },
        ],
      },
    },
    { $count: "totalTweetLikes" },
  ]);

  // it will return the list so extract the first element and get particular field
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalViews: totalViewsAndVideos[0]?.totalViews,
        totalVideos: totalViewsAndVideos[0]?.totalVideos,
        totalSubs: totalSubs[0]?.totalSubscribers,
        totalTweets: totalTweets[0]?.totalTweets,
        totalComments: totalComments[0]?.totalComments,
        totalVideoLikes: totalVideoLikes[0]?.totalVideoLikes,
        totalCommentLikes: totalCommentLikes[0]?.totalCommentLikes,
        totalTweetLikes: totalTweetLikes[0]?.totalTweetLikes,
      },
      "Stats of the chanel"
    )
  );
});
//////////////////////////////////////////////////////////////////////////

////////////////////// Gcribers, total et all the videos uploaded by the channel ///////////////////////
// TODO: Get all the videos uploaded by the channel
// 1. get channelID, page, limit from req.body and req.query
// 2. find videos where Owner is channelID and isPublished is true
// 2.1 lookup the user collection to get the Owner details
// 2.2 unwind the ownerDetails array (Unwind the array to get a single document for each video)
// 2.3 add fields like username, fullName, avatar
// 2.4 project the ownerDetails (ownerDetails wont be shown in the final output)
const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  // 1. get channelID, page, limit from req.body and req.query
  const { channelID } = req.body;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(channelID)) {
    throw new ApiError(400, "channel not found");
  }

  // 2. find videos where Owner is channelID and isPublished is true
  let pipeline = [
    {
      $match: {
        $and: [
          { Owner: new mongoose.Types.ObjectId(channelID) },
          { isPUblished: true },
        ],
      },
    },
    {
      // 2.1 lookup the user collection to get the Owner details
      $lookup: {
        from: "users", // The name of the User collection in MongoDB
        localField: "Owner", // The field in the Video collection
        foreignField: "_id", // The field in the User collection that matches
        as: "ownerDetails", // The name of the array field to store the matched user documents
      },
    },
    {
      // 2.2 unwind the ownerDetails array (Unwind the array to get a single document for each video)
      $unwind: "$ownerDetails", // Unwind the array to get a single document for each video
    },
    {
      // 2.3 add fields like username, fullName, avatar
      $addFields: {
        username: "$ownerDetails.username", // Add the username field from the user document
        fullName: "$ownerDetails.fullName",
        avatar: "$ownerDetails.avatar",
      },
    },
    {
      $project: {
        // 2.4 project the ownerDetails (ownerDetails wont be shown in the final output)
        ownerDetails: 0, // Optionally remove the ownerDetails field from the final output
      },
    },
  ];

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "total_videos",
      docs: "Videos",
    },
  };

  const videos = await Video.aggregatePaginate(pipeline, options);

  if (videos?.total_videos === 0) {
    throw new ApiError(400, "Videos Not Found");
  }

  return res.status(200).json(new ApiResponse(200, { videos }, "Videos Found"));
});
//////////////////////////////////////////////////////////////////////////

export { getChannelStats, getChannelVideos };
