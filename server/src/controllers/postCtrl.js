const Posts = require("../models/postModel");
const { sendError } = require("../utils/helper");
const cloudinary = require('../cloud');
const postCtrl = {
  createPost: async (req, res) => {
    const { content, images } = req.body;

    if (!images.length) return sendError(res, "Hình không được bỏ trống");

    const newPost = new Posts({
      content,
      images,
      user: req.user._id,
    });

    await newPost.save();
    res.status(200).json({
      msg: "Tạo post thành công",
      post: newPost,
    });
  },
  getPosts: async (req, res) => {
    const posts = await Posts.find({
      user: [...req.user.following, req.user._id],
    }).populate("user likes", "avatar userName fullName");


    res.status(200).json({ msg: "Thành công!", result: posts.length, posts });
  },
  uploadImg: async (req, res) => {
    const {file} = req;

    if(!file) return sendError(res,'Hình ảnh rỗng');

  const {public_id,url} = await  cloudinary.uploader.upload(file.path,{height: 500,width:500,folder: 'instagram-clone'})

    res.status(200).json({public_id,url})
  }
};

module.exports = postCtrl;
