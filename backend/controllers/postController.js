const { CustomError } = require("../middlewares/error");
const Post = require("../models/Post");
const User = require("../models/User");
const { generateFileUrl } = require("../utils/utils");

const createPostController = async (req, res, next) => {
  const { userId } = req.params;
  const { caption } = req.body;
  const files = req.files ?? [];

  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new CustomError("User not found", 404);

    const imageUrls = files.map((file) => generateFileUrl(file.filename));
    const newPost = new Post({
      user: userId,
      caption,
      image: imageUrls,
    });
    await newPost.save();
    currentUser.posts.push(newPost._id);
    await currentUser.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    next(error);
  }
};

const updatePostController = async (req, res, next) => {
  const { postId } = req.params;
  const { caption } = req.body;

  try {
    const currentPost = await Post.findByIdAndUpdate(
      postId,
      { caption },
      { new: true }
    );
    if (!currentPost) throw new CustomError("Post not found", 404);

    res.status(200).json({
      message: "Post caption updated successfully",
      post: currentPost,
    });
  } catch (error) {
    next(error);
  }
};

const getPostsController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new CustomError("User not found", 404);

    const blockedUserIds = currentUser.blockList.map((id) => id.toString());
    const allPosts = await Post.find({
      user: { $nin: blockedUserIds },
    }).populate("user", "username fullName profilePicture");

    res.status(200).json({ posts: allPosts });
  } catch (error) {
    next(error);
  }
};

const getUserPostsController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new CustomError("User not found", 404);

    const currentUserPosts = await Post.find({ user: userId });

    res.status(200).json({ posts: currentUserPosts });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const postToDelete = await Post.findById(postId);
    if (!postToDelete) throw new CustomError("Post not found", 404);

    const postUser = await User.findById(postToDelete.user);

    postUser.posts = postUser.posts.filter(
      (postId) => postId.toString() !== postToDelete._id.toString()
    );
    await postUser.save();
    await postToDelete.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPostController,
  updatePostController,
  getPostsController,
  getUserPostsController,
  deletePostController,
};
