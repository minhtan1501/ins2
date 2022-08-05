const Posts = require("../models/postModel");
const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");
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
    })
      .sort("-createdAt")
      .populate("user likes", "avatar userName fullName")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });

    res.status(200).json({ msg: "Thành công!", result: posts.length, posts });
  },
  uploadImg: async (req, res) => {
    const { file } = req;

    if (!file) return sendError(res, "Hình ảnh rỗng");

    const { public_id, url } = await cloudinary.uploader.upload(file.path, {
      height: 500,
      width: 500,
      folder: "instagram-clone",
    });

    res.status(200).json({ public_id, url });
  },
  updatePost: async (req, res) => {
    const { content, images } = req.body;

    const post = await Posts.findByIdAndUpdate(
      { _id: req.params.id },
      {
        content,
        images,
      },
      { new: true }
    ).populate("user likes", "avatar userName fullName");
    res.status(200).json({
      msg: "Cập nhật post thành công",
      newPost: {
        ...post._doc,
        content,
        images,
      },
    });
  },
  likePost: async (req, res) => {
    const post = await Posts.find({ _id: req.params.id, likes: req.user._id });
    if (post.length) return sendError(res, "Bạn đã thích bài viết này!");

    await Posts.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );

    return res.status(200).json({ msg: "" });
  },
  unLikePost: async (req, res) => {
    await Posts.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    return res.status(200).json({ msg: "" });
  },
};

module.exports = postCtrl;
