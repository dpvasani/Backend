import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";

////////////////////////// create tweet //////////////////////////
//TODO: create tweet
// 1. get content from req.body
// 2. post tweet to db
const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet

  // 1. get content from req.body
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Please write some TWEET!");
  }

  // 2. post tweet to db
  const postTweet = await Tweet.create({
    owner: req.user?._id,
    content: content,
  });

  if (!postTweet) {
    return new ApiError(400, "Tweet not posted!");
  }

  return res.status(200).json(new ApiResponse(200, postTweet, "Tweet Posted!"));
});
///////////////////////////////////////////////////////////////////

////////////////////////// get user tweets //////////////////////////
// TODO: get user tweets
// 1. get userId from params URL
// 2. find all the tweets of the user
// 3. return the list of tweets
const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  // 1. get userId from params URL
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid USerId");
  }

  // 2. find all the tweets of the user
  const userTweet = await Tweet.find({
    owner: new mongoose.Types.ObjectId(userId),
  });

  if (userTweet.length === 0) {
    return new ApiError(500, "No tweet found!");
  }

  // 3. return the list of tweets
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { Total_Tweets: userTweet.length, Tweet: userTweet },
        "Tweets found!"
      )
    );
});
///////////////////////////////////////////////////////////////////

////////////////////////// update tweet //////////////////////////
//TODO: update tweet
// 1. get tweetId from params URL and content from req.body
// 2. find the tweet by tweetId and req.user._id. // only owner can update the tweet
// 3. update the tweet content and save it to the database
const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  // 1. get tweetId from params URL and content from req.body
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet");
  }
  if (!content) {
    throw new ApiError(400, "Please write something!");
  }

  // 2. find the tweet by tweetId and req.user._id. // only owner can update the tweet
  const findTweet = await Tweet.findOne({
    $and: [
      { owner: new mongoose.Types.ObjectId(req.user?._id) },
      { _id: tweetId },
    ],
  });

  if (!findTweet) {
    throw new ApiError(400, "You are not authorized to update this tweet");
  }

  // 3. update the tweet content and save it to the database
  findTweet.content = content;
  const updatedTweet = await findTweet.save();

  if (!updatedTweet) {
    throw new ApiError(500, "Tweet not updated!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});
///////////////////////////////////////////////////////////////////

////////////////////////// delete tweet //////////////////////////
//TODO: delete tweet
// 1. get tweetId from params URL
// 2. check if the user is the owner of the tweet
// 3. if yes then delete the tweet
const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  // 1. get tweetId from params URL
  const { tweetId } = req.params;
  console.log(req.user._id);

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet");
  }

  // 2. check if the user is the owner of the tweet
  const findTweet = await Tweet.findOne({
    $and: [
      { owner: new mongoose.Types.ObjectId(req.user?._id) },
      { _id: tweetId },
    ],
  });

  if (!findTweet) {
    return res
      .status(500)
      .json(
        new ApiError(500, {}, "You are not authorized to delete this tweet")
      );
  }

  // 3. if yes then delete the tweet
  const delTweet = await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, delTweet, "Tweet deleted successfully!"));
});
///////////////////////////////////////////////////////////////////

export { createTweet, getUserTweets, deleteTweet, updateTweet };
