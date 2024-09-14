import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";

////////////////////////// create playlist //////////////////////////
//TODO: create playlist
// 1. get name and description from req.body
// 2. create document in db and dont add any video
const createPlaylist = asyncHandler(async (req, res) => {
  // 1. get name and description from req.body
  //TODO: create playlist
  const { name, description } = req.body;
  if (!name && !description) {
    throw new ApiError(400, "Please provide name and description");
  }

  // 2. create document in db and don't add any video
  const createPlayList = await Playlist.create({
    name: name,
    description: description,
    owner: new mongoose.Types.ObjectId(req.user._id),
  });

  if (!createPlayList) {
    throw new ApiError(400, "Playlist not created please try again!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createPlayList, "playlist Created!"));
});
/////////////////////////////////////////////////////////////////

//////////////////////// get user playlists //////////////////////////
// 1. get userId from params URL
// 2. find all the playlists of the user
//TODO: get user playlists
const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists
  // 1. get userId from params URL
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId!");
  }

  // 2. find all the playlists of the user
  const getPlaylist = await Playlist.find({
    owner: I,
  });

  if (!getPlaylist) {
    throw new ApiError(400, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getPlaylist, "playlist found"));
});
/////////////////////////////////////////////////////////////////

//////////////////////// get playlist by id //////////////////////////
// 1. get playlistId from params URL
// 2. find the playlist by id
//TODO: get playlist by id
const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id
  // 1. get playlistId from params URL
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid PlayListId!");
  }

  // 2. find the playlist by id
  const findPlaylist = await Playlist.findById(playlistId);
  if (!findPlaylist) {
    throw new ApiError(400, "Playlist not Found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, findPlaylist, "Playlist Found!"));
});
/////////////////////////////////////////////////////////////////

//////////////////////// add video to playlist //////////////////////////
// 1. get playlistId and videoId from params URL
// 2. find the playlist by playlistId in db
// 3. check if the playlist owner is the same as the logged-in user
// 4. check if the video already exists in the playlist
// 5. push the video to the playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // 1. get playlistId and videoId from params URL
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlistId or videoId");
  }

  // 2. find the playlist by playlistId in db
  const findPlaylist = await Playlist.findById(playlistId);

  if (!findPlaylist) {
    throw new ApiError(400, "Playlist not found!");
  }

  // 3. check if the playlist owner is the same as the logged-in user
  if (!findPlaylist.owner.equals(req.user?._id)) {
    throw new ApiError(400, "You cant update this playlist!");
  }

  // 4. check if the video already exists in the playlist
  if (findPlaylist.video.includes(videoId)) {
    throw new ApiError(
      400,
      "Video already exists in playlist You cant add this video in the playlist!"
    );
  }

  // 5. push the video to the playlist
  findPlaylist.video.push(videoId);
  const videoAdded = await findPlaylist.save();

  if (!videoAdded) {
    throw new ApiError(
      500,
      "Video is not added in the playlist please try again!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoAdded, "Video added in the playlist!"));
});
/////////////////////////////////////////////////////////////////

//////////////////////// remove video from playlist //////////////////////////
// TODO: remove video from playlist
// 1. get playlistId and videoId from params URL
// 2. find the playlist by playlistId in db based on playlistId and videoId
// 3. check if the playlist owner is the same as the logged-in user
// 4. remove the video from the playlist and save it to the database
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
  // 1. get playlistId and videoId from params URL
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlistId or videoId");
  }

  // 2. find the playlist by playlistId in db based on playlistId and videoId
  const findVideo = await Playlist.findOne({
    $and: [{ _id: playlistId }, { video: videoId }],
  });

  if (!findVideo) {
    throw new ApiError(400, "Playlist not found!");
  }

  // 3. check if the playlist owner is the same as the logged-in user
  if (!findVideo.owner.equals(req.user?._id)) {
    throw new ApiError(400, "You can't update this playlist!");
  }

  // 4. remove the video from the playlist and save it to the database
  findVideo.video.pull(videoId);
  const videoRemoved = await findVideo.save();

  if (!videoRemoved) {
    throw new ApiError(400, "Please Try again!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoRemoved, "Video Removed Successfully"));
});
/////////////////////////////////////////////////////////////////

//////////////////////// delete playlist //////////////////////////
// 1. get playlistId from params URL
// 2. find the playlist by id
// 3. check if the playlist owner is the same as the logged-in user
// 4. delete the playlist
// TODO: delete playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist
  // 1. get playlistId from params URL
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlistId");
  }

  // 2. find the playlist by id
  const findPlaylist = await Playlist.findById(playlistId);
  if (!findPlaylist) {
    throw new ApiError(500, "playlist not found!");
  }

  // 3. check if the playlist owner is the same as the logged-in user
  if (!findPlaylist.owner.equals(req.user?._id)) {
    throw new ApiError(400, "You can't delete this playlist!");
  }

  // 4. delete the playlist
  const playlistDeleted = await Playlist.findByIdAndDelete(playlistId);
  if (!playlistDeleted) {
    throw new ApiError(500, "playlist not delete. Please try again!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlistDeleted, "playlist deleted successfully!")
    );
});
/////////////////////////////////////////////////////////////////

//////////////////////// update playlist //////////////////////////
// 1. get playlistId from params URL
// 2. get name and description from req.body
// 3. find the playlist by id
// 4. check if the playlist owner is the same as the logged-in user
// 5. update the playlist
//TODO: update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist
  // 1. get playlistId from params URL
  // 2. get name and description from req.body
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlistId");
  }
  if (!name && !description) {
    throw new ApiError(400, "Please provide name and description");
  }

  // 3. find the playlist by id
  const findPlaylist = await Playlist.findById(playlistId);
  if (!findPlaylist) {
    throw new ApiError(500, "Playlist not found!");
  }

  // 4. check if the playlist owner is the same as the logged-in user
  if (!findPlaylist.owner.equals(req.user?._id)) {
    throw new ApiError(400, "You can't update this playlist!");
  }

  // 5. update the playlist
  findPlaylist.name = name;
  findPlaylist.description = description;

  const playlistUpdated = await findPlaylist.save();
  if (!playlistUpdated) {
    throw new ApiError(500, "Please try again!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlistUpdated, "Playlist updated successfully!")
    );
});
/////////////////////////////////////////////////////////////////

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
