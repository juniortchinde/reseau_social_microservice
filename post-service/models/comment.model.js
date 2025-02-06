const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        user: {
            type: {
                _id: false,
                posterId: mongoose.Schema.Types.ObjectId,
                name: String,
                avatar: String,
            },
            required: true
        },
        content: {
            type: String,
            trim: true,
            maxLength: 1000,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('comments', commentSchema);