const { CustomError } = require("../middlewares/error");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const createNewConversationController = async (req, res, next) => {
  const { firstUser, secondUser } = req.body;
  try {
    if (firstUser === secondUser)
      throw new CustomError("Sender and reciever cannot be same", 400);
    const newConversation = new Conversation({
      participants: [firstUser, secondUser],
    });
    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (error) {
    next(error);
  }
};

const getConversationOfUserController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    });
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

const getTwoUsersConversationController = async (req, res, next) => {
  const { firstUserId, secondUserId } = req.params;
  try {
    const conversation = await Conversation.find({
      participants: { $in: [firstUserId, secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

const deleteConversationController = async (req, res, next) => {
  const { conversationId } = req.params;
  try {
    await Conversation.deleteOne({ _id: conversationId });
    await Message.deleteMany({ conversationId });
    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewConversationController,
  getConversationOfUserController,
  getTwoUsersConversationController,
  deleteConversationController,
};
