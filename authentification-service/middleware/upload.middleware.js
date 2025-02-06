const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb)=>{
        const filename = req.params.id+'.jpg'
        cb(null, filename)
    },
    destination: (req, file, cb)=>{
        cb(null, 'client/public/uploads/profil/')
    }
});

module.exports = storage;