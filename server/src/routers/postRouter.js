const router = require('express').Router();
const postCtrl = require('../controllers/postCtrl');
const {auth} = require('../middleware/auth');
const { uploadImage } = require('../middleware/multer');

router.route('/posts')
        .post(auth,postCtrl.createPost)
        .get(auth,postCtrl.getPosts)
        
router.post('/posts/upload-img',uploadImage.single('file'),postCtrl.uploadImg)



module.exports = router