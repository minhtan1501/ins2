const multer = require('multer');
const storage = multer.diskStorage({});

const imageFileFilter = (req, file, cb) => {
    console.log(file);
    if(!file.mimetype.startsWith('image') && !file.mimetype.startsWith('video')){
         cb('Chỉ hỗ trợ hình ảnh và video!', false);
    }
    cb(null, true);
}
exports.uploadImage =  multer({storage,fileFilter:imageFileFilter})
