import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

///////////////////////// get all comments for a video //////////////////////////
//TODO: get all comments for a video
// 1. get videoId from params URL
// 2. create a pipeline to match the videoId
// 3. use aggregatePaginate to get all comments
const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  // 1. get videoId from params URL
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid VIdeo");
  }

  // 2. create a pipeline to match the videoId
  let pipeline = [{ $match: { video: new mongoose.Types.ObjectId(videoId) } }];

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "total_comments",
      docs: "Comments",
    },
  };

  // 3. use aggregatePaginate to get all comments
  const allComments = await Comment.aggregatePaginate(pipeline, options);

  if (allComments?.total_comments === 0) {
    throw new ApiError(400, "Comments not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { Commnets: allComments, size: allComments.length })
    );
});
////////////////////////////////////////////////////////////////////////////

///////////////////////// add a comment to a video //////////////////////////
// 1. get videoId from params URL and content from req.body
// 2. create a new comment and save it to the database
const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  // 1. get videoId from params URL and content from req.body
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(500, {}, "Invalid video");
  }
  if (!content) {
    throw new ApiError(400, {}, "Please enter valid comment");
  }

  // 2. create a new comment and save it to the database
  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: new mongoose.Types.ObjectId(req.user?._id),
  });
  if (!comment) {
    throw new ApiError(500, comment, "Comment not Saved to Db");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});
////////////////////////////////////////////////////////////////////////////

///////////////////////// update a comment //////////////////////////
// TODO: update a comment
// 1. get commentId from params URL and content from req.body
// 2. find the comment by commentId and req.user._id. // only owner can update the comment
// 3. update the comment content and save it to the database
const updateComment = asyncHandler(async (req, res) => {
  // 1. get commentId from params URL and content from req.body
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }
  if (content.length === 0) {
    throw new ApiError(400, "Invalid commentId");
  }

  // 2. find the comment by commentId and req.user._id. // only owner can update the comment
  const comment = await Comment.findOne({
    _id: commentId, // find comment by commentId
    owner: req.user._id, // find owner of comment by req.user._id
  });
  if (!comment) {
    throw new ApiError(400, "comment not found");
  }

  // 3. update the comment content and save it to the database
  comment.content = content;

  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

///////////////////////// delete a comment //////////////////////////
// TODO: delete a comment
// 1. get commentId from params URL
// 2. delete the comment from the database based on the commentId and req.user._id (only owner can delete the comment)
// 3. if deletedCount is 0, return an error message
const deleteComment = asyncHandler(async (req, res) => {
  // 1. get commentId from params URL
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, {}, "Invalid commentId");
  }

  // 2. delete the comment from the database based on the commentId and req.user._id
  const delComment = await Comment.deleteOne({
    $and: [
      { _id: commentId }, // Find comment by commentId
      { owner: req.user._id },
    ], // Ensure the comment is owned by the current user
  });
  if (!delComment) {
    throw new ApiError(500, "comment not found");
  }

  // 3. if deletedCount is 0, return an error message
  // delComment will return object -> { acknowledged: true, deletedCount: 0 }
  // deletedCount:0 means comment found and not deleted
  // deletedCount:1 means comment found and deleted
  if (delComment.deletedCount === 0) {
    return res
      .status(500)
      .json(new ApiError(500, "You are not authorized to delete this comment"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, delComment, "Comment deleted successfully"));
});
///////////////////////////////////////////////////////////////////////

export { getVideoComments, addComment, updateComment, deleteComment };
