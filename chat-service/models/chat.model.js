const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    users: {
        type: Array,
        required: true
    },
    text: {
        type: String,
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('chats', chatSchema)