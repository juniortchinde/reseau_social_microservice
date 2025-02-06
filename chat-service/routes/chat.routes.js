const router = require("express").Router();
const chatCtrl = require("../controllers/chat.controller");
const messageCtrl = require("../controllers/message.controller");

router.post('/createNewChat', chatCtrl.createNewChat)
router.get('/getAllChats', chatCtrl.getChats)
router.get('/getChat/:chatId', chatCtrl.getChat)
router.post("/sendMessage:chatId", messageCtrl.sendMessage)

module.exports = router;
