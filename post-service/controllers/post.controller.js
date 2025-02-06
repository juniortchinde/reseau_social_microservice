const PostModel = require("../models/post.model");
const CommentModel = require("../models/comment.model");
const LikeModel = require("../models/like.model");
const {getUserDetails} = require("../utils/messageBroker");

const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
    try {
        const postList = await PostModel.find().sort({ createdAt: -1})
        for(const post of postList){

        }
        res.json({success: true, postList})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
};

module.exports.getPost = async (req, res) => {
    try {
        let post = await PostModel.findById(req.params.postId)
        if(!post) return res.status(400).json({msg: "Post does not exist."})

        const commentList = await CommentModel.find({postId: req.params.postId}).limit(5);
        const likes = await LikeModel.countDocuments({postId: req.params.postId});
        post["comments"] = commentList;
        post["likes"] = likes;

        return res.json({success: true, post})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
};


module.exports.createPost = async (req, res) => {
    let images = [];
    if(req.files)
    {
        req.files.forEach(file => {
            images.push(`${req.protocol}://${req.get('host')}/public/images/${file.filename}`);
       });
    }
    const userId = req.headers['x-user-id'];
    console.log(req.body)
    const  user = await  getUserDetails(userId);
    console.log(user)
    const newPost = new PostModel({
    pictures: images,
    user:{
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
    },
    message: req.body.message,
  });

  try {
    await newPost.save();
    return res.status(201).json({message: "create post successfull"});

  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.postId))
            return res.status(400).send("Id unknown :" + req.params.postId);

        const userId = req.headers['x-user-id'];
        const posterId = req.params.postId;
        const post = await PostModel.findOne({
            _id: req.params.id,
            posterId
        });

        if(!post) {
            return res.status(401).json("non autorisé")
        }

        let images = [];
        if(req.files)
        {
            req.files.forEach(file => {
            images.push(`${req.protocol}://${req.get('host')}/public/images/${file.filename}`);
            });
        }

    
      await PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: {
            message: req.body.message,
            pictures: images}
        }
      );

      return res.status(200).json({message: "mise à jour du poste réussit"})
    }

    catch(err){

    }
};

module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.postId))
    return res.status(400).send("Id unknown :" + req.params.postId);

  PostModel.findByIdAndDelete(req.params.postId, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Deleted error : " + err);
  });
};

/* ------------------------------------ Likes -------------------------------------*/
module.exports.likePost = async (req, res) =>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send( { success : false ,message : "Post does not exist" });

    try{
        const userId = req.headers['x-user-id'];
        const postId = req.params.postId;
        const newLike = new LikeModel({
            userId,
            postId
        })
        await newLike.save();
        return res.status(200).json( {success: true, message: "like successfull"})
    }
    catch(err) {
        return res.status(400).send(err);
    }
    
}

module.exports.unlikePost = async (req, res) =>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("Id unknown :" + req.params.id);

    try{

        const userId = req.headers['x-user-id'];
        const postId = req.params.postId;
        await LikeModel.deleteOne({
            userId,
            postId
        })
        return res.status(200).json({ success: true, message: "unlike successfull"})
    }
    catch(err) {
        return res.status(400).send(err);
    }
}

