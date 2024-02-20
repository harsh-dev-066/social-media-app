const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Story = require("../models/Story");
const { CustomError } = require("../middlewares/error");

const getUserController = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new CustomError("User not found", 404);

    const { password, ...data } = currentUser._doc;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req, res, next) => {
  const { userId } = req.params;
  const updatedUser = req.body;

  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new CustomError("User not found", 404);

    Object.assign(currentUser, updatedUser);
    await currentUser.save();
    res
      .status(200)
      .json({ message: "User updated successfully", user: currentUser });
  } catch (error) {
    next(error);
  }
};

const folowUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id)
      throw new CustomError("You cannont follow yourself", 500);

    const userToFollow = await User.findById(userId);
    const loggedInUser = await User.findById(_id);
    if (!userToFollow || !loggedInUser) {
      throw new CustomError("User not found", 404);
    }
    if (loggedInUser.following.includes(userId)) {
      throw new CustomError("Already following user", 400);
    }

    loggedInUser.following.push(userId);
    userToFollow.followers.push(_id);
    await userToFollow.save();
    await loggedInUser.save();
    res.status(200).json({ message: "Following user successfully" });
  } catch (error) {
    next(error);
  }
};

const unfolowUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id)
      throw new CustomError("You cannont unfollow yourself", 500);

    const userToUnfollow = await User.findById(userId);
    const loggedInUser = await User.findById(_id);
    if (!userToUnfollow || !loggedInUser) {
      throw new CustomError("User not found", 404);
    }
    if (!loggedInUser.following.includes(userId)) {
      throw new CustomError("Already not follwing user", 400);
    }

    loggedInUser.following = loggedInUser.following.filter(
      (id) => id.toString() !== userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== _id
    );
    await userToUnfollow.save();
    await loggedInUser.save();
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    next(error);
  }
};

const blockUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id)
      throw new CustomError("You cannont block yourself", 500);

    const userToBlock = await User.findById(userId);
    const loggedInUser = await User.findById(_id);
    if (!userToBlock || !loggedInUser) {
      throw new CustomError("User not found", 404);
    }
    if (loggedInUser.blockList.includes(userId)) {
      throw new CustomError("Already user blocked", 400);
    }

    loggedInUser.blockList.push(userId);

    if (!loggedInUser.following.includes(userId)) {
      loggedInUser.following = loggedInUser.following.filter(
        (id) => id.toString() !== userId
      );
      userToBlock.followers = userToBlock.followers.filter(
        (id) => id.toString() !== _id
      );
    }

    await loggedInUser.save();
    await userToBlock.save();
    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    next(error);
  }
};

const unblockUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id)
      throw new CustomError("You cannont unblock yourself", 500);

    const userToUnblock = await User.findById(userId);
    const loggedInUser = await User.findById(_id);
    if (!userToUnblock || !loggedInUser) {
      throw new CustomError("User not found", 404);
    }
    if (!loggedInUser.blockList.includes(userId)) {
      throw new CustomError("Already user unblocked", 400);
    }

    loggedInUser.blockList = loggedInUser.blockList.filter(
      (id) => id.toString() !== userId
    );
    await loggedInUser.save();
    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    next(error);
  }
};

const getBlockListController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new CustomError("User not found", 404);

    res.status(200).json({ blockList: currentUser.blockList ?? [] });
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const userToDelete = await User.findById(userId);
    if (!userToDelete) throw new CustomError("User not found", 404);

    await Post.deleteMany({ user: userId });
    await Post.deleteMany({ "comments.user": userId });
    await Post.deleteMany({ "comments.replies.user": userId });
    await Comment.deleteMany({ user: userId });
    await Story.deleteMany({ user: userId });
    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });
    await User.updateMany(
      { _id: { $in: userToDelete.following } },
      { $pull: { followers: userId } }
    );
    await User.updateMany(
      { _id: { $in: userToDelete.followers } },
      { $pull: { following: userId } }
    );
    await Comment.updateMany({}, { $pull: { likes: userId } });
    await Comment.updateMany(
      { "replies.likes": userId },
      { $pull: { "replies.likes": userId } }
    );
    await Post.updateMany({}, { $pull: { likes: userId } });

    const replyComments = await Comment.find({ "replies.user": userId });

    await Promise.all(
      replyComments.map(async (comment) => {
        comment.replies = comment.replies.filter(
          (reply) => reply.user.toString() != userId
        );
        await Comment.save();
      })
    );

    await userToDelete.deleteOne();
    res.status(200).json({
      message: "Everything associated with user is deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const searchUserController = async (req, res, next) => {
  const { query } = req.params;
  console.log({ query });
  try {
    if (!query.trim()) throw new CustomError("Provide valid query", 404);
    const users = await User.find({
      $or: [
        { username: { $regex: new RegExp(query, "i") } },
        { fullName: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const generateFileUrl = (filename) => {
  return process.env.URL + `/uploads/${filename}`;
};

const uploadProfilePictureController = async (req, res, next) => {
  const { userId } = req.params;
  const { filename } = req.file;

  try {
    const currentUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: generateFileUrl(filename) },
      { new: true }
    );
    if (!currentUser) throw new CustomError("User not found", 404);

    res
      .status(200)
      .json({ message: "Profile picture updated sucessfully", currentUser });
  } catch (error) {
    next(error);
  }
};

const uploadCoverPictureController = async (req, res, next) => {
  const { userId } = req.params;
  const { filename } = req.file;

  try {
    const currentUser = await User.findByIdAndUpdate(
      userId,
      { coverPicture: generateFileUrl(filename) },
      { new: true }
    );
    if (!currentUser) throw new CustomError("User not found", 404);

    res
      .status(200)
      .json({ message: "Cover picture updated sucessfully", currentUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserController,
  updateUserController,
  folowUserController,
  unfolowUserController,
  blockUserController,
  unblockUserController,
  getBlockListController,
  deleteUserController,
  searchUserController,
  uploadProfilePictureController,
  uploadCoverPictureController,
};
