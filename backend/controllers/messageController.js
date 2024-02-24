const Message = require("../models/Message");

const createMessageController = async (req, res, next) => {
  const { conversationId, sender, text } = req.body;
  try {
    const newMessage = await Message({
      conversationId,
      sender,
      text,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

const getMessagesController = async (req, res, next) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversationId });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

const deleteMessageController = async (req, res, next) => {
  const { messageId } = req.params;
  try {
    await Message.deleteOne({ _id: messageId });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessageController,
  getMessagesController,
  deleteMessageController,
};
