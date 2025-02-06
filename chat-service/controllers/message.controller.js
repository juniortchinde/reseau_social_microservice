const Message = require("../models/message.model");
const Chat = require("../models/chat.model");
const {getUserDetails} = require('../utils/messageBroker')
const Messages = require("../models/message.model");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
module.exports.allMessages = async (req, res) => {
    try {

        const userId = req.headers['x-user-id'];
        const chatId = req.params.chatId;
        const messages = await Message.find({ chatId: chatId })
            .populate("chats");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
module.exports.sendMessage = async (req, res) => {
    try {

        const { content} = req.body;
        const chatId = req.params.chatId;
        const userId = req.headers['x-user-id'];

        if (!content || !chatId) {
            console.log("Invalid data passed into request");
            return res.sendStatus(400);
        }

        const user = await getUserDetails(userId);
        const newMessage = new Message({
            sender: user,
            content: content,
            chat: chatId,
        });

        await newMessage.save();

        await Chat.findOneAndUpdate({_id: chatId}, { latestMessage: message._id });

        res.json({ success: true, message: " nouveau message envoyé avec success" });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

module.exports.deleteMessages =  async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        await Messages.findOneAndDelete({_id: req.params.messageId, sender: userId})
        res.status(200).json({success: true, message:  'Delete Success!'})
    }

    catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

