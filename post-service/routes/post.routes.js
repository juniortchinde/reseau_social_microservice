const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require('../middleware/upload');

router.get('/readPost', postController.readPost);
router.post('/createPost', multer, postController.createPost);
router.put('/updataPost/:id', multer, postController.updatePost);
router.get('/getPost/:id', postController.getPost);
router.delete('deletePost/:id', postController.deletePost);
router.patch('/likePost/:id', postController.likePost);
router.patch('/unlikePost/:id', postController.unlikePost);

module.exports = router;