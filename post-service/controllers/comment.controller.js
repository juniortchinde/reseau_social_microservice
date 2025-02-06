const {getUserDetails} = require("../utils/messageBroker");
const CommentModel = require("../models/comment.model");
const {ObjectId} = require("mongoose").Schema.Types;

module.exports.commentPost = async (req, res) =>{
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send("Id unknown :" + req.params.id);
    try {

        const userId = req.headers['x-user-id'];
        const postId = req.params.postId;
        const user = await getUserDetails(userId);
        const comment = new CommentModel({
            user: {
                userId: user.userId,
                name: user.name,
                avatar: user.avatar
            },
            postId,
            content: req.body.content,
        })
        await comment.save();
        return res.status(200).json({ success: true, message: "comment successfull"})
    }
    catch(err){
        res.status(400).send(err);
    }

};

module.exports.deleteCommentPost = async (req, res) =>{
    if (!ObjectId.isValid(req.params.postId))
        return res.status(400).send("Id unknown :" + req.params.id);

    try{

        const userId = req.headers['x-user-id'];
        const postId = req.params.postId;

        const commentDelete = await CommentModel.deleteOne({
            userId,
            postId
        })

        console.log(commentDelete)

        return res.status(200).json({message: "comment deleted successfull successfull"})

    }
    catch(err){
        return res.status(400).send(err);
    }
}

module.exports.editCommentPost = async (req, res) =>{
    if (!ObjectId.isValid(req.params.postId))
        return res.status(400).send("Id unknown :" + req.params.postId);

    try{
        const userId = req.headers['x-user-id'];
        const postId = req.params.postId;
        const editComment = await CommentModel.updateOne(
            {
                userId,
                postId
            },
            {
                content: req.body.content,
            }
        )
        console.log(editComment)
        return res.status(200).json({message: "edit comment  successfull"})
    }
    catch(err){
        return res.status(400).send(err);
    }
}

