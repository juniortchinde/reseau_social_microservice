const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: {
      _id: false,
      userId: mongoose.Schema.Types.ObjectId,
      name: String,
      avatar: String,
    },
    required: true
  },
  message: {
    type: String,
    trim: true,
    maxLength: 500,
  },
  pictures: {
    type: [String],
  },
},
{
    timestamps: true,   
}
);

module.exports = mongoose.model('post', PostSchema);