const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images');
  },
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}_${Date.now()}.jpg`);
  }
});

module.exports = multer({storage: storage}).array('images');