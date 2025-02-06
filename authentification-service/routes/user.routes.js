const router = require('express').Router();
const storage = require('../middleware/upload.middleware');
const multer = require('multer');
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;