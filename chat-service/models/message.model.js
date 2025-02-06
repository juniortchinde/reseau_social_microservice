const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    chatId : {
        type: mongoose.Types.ObjectId, ref: 'chats',
        required: true
    },
    sender: { type: Object, required: true },
    text: String,
}, {
    timestamps: true
})

module.exports = mongoose.model('messages', messageSchema)