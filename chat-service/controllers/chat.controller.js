const Chats = require('../models/chat.model')
const Messages = require('../models/message.model')
const {getUserDetails} = require('../utils/messageBroker')

module.exports.createNewChat = async (req, res) => {
	try {
		const senderId = req.headers['x-user-id'];
		console.log(senderId);
		const { recipientId, text } = req.body
		console.log(req.body.recipientId);
		if(!recipientId || (!text.trim()))
			return res.status(400).send({success: false, message: 'Recipient id is required'});

		const sender = await getUserDetails(senderId);
		console.log(sender);
		const recipient = await getUserDetails(recipientId);
		console.log(recipient);
		const chat = await Chats.findOne({"users._id": { $all: [senderId, recipientId] } })

		if(!chat) {
			const newChat = new Chats({
				users: [sender, recipient]
			})
			await newChat.save()

			const newMessage = new Messages({
				chatId: newChat._id,
				sender,
				text
			})

			console.log(newChat);
			await Chats.updateOne({_id: newChat._id}, {latestMessage: newMessage._id})
			await newMessage.save()
		}
		else {

			const newMessage = new Messages({
				chatId: chat._id,
				sender,
				text
			})
			await Chats.updateOne({_id: newChat._id}, {latestMessage: chat._id})
			await newMessage.save()
		}

		console.log("fin de la requête")
		return res.status(200).json({success: true, message: 'Create new chat successfull !'})

	} catch (err) {
		return res.status(500).json({msg: err.message})
	}
}

module.exports.getChats = async (req, res) => {
	try {
		const userId = req.headers['x-user-id'];

		const chats = Chats.find({"users._id": userId})
			.populate("latestMessages", "text")

		res.status(200).json({success: true, chats})

	} catch (err) {
		return res.status(500).json({msg: err.message})
	}
}

module.exports.getChat = async (req, res) => {
	try {
		const userId = req.headers['x-user-id'];

		const chats = Chats.findOne({_id: req.params.chatId})
			.populate("latestMessages", "text")

		res.status(200).json({success: true, chat})

	} catch (err) {
		return res.status(500).json({msg: err.message})
	}
}


