const User = require("../models/User");
const { CustomError } = require("../middlewares/error");

const getUserController = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new CustomError("User not found", 404);

    const { password, ...data } = currentUser._doc;
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(err);
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
    next(err);
  }
};

module.exports = {
  getUserController,
  updateUserController,
};
