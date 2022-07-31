const router = require('express').Router();
const postCtrl = require('../controllers/postCtrl');
const {auth} = require('../middleware/auth');
const { uploadImage } = require('../middleware/multer');

router.route('/posts')
        .post(auth,postCtrl.createPost)
        .get(auth,postCtrl.getPosts)
        
router.route('/posts/:id')
        .patch(postCtrl.updatePost)

router.post('/posts/upload-img',uploadImage.single('file'),postCtrl.uploadImg)

router.patch(`/posts/:id/like`,auth,postCtrl.likePost)
router.patch(`/posts/:id/unlike`,auth,postCtrl.unLikePost)

module.exports = router