const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
       userId: {
           type: mongoose.Schema.Types.ObjectId,
           required: true,
       },
       postId: {
           type: mongoose.Schema.Types.ObjectId,
           required: true,

       }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('likes', commentSchema);