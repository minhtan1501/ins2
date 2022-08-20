const Posts = require("../models/postModel");
const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");
const { isValidObjectId } = require("mongoose");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  counting = () => {
    this.query = this.query.count();
    return this;
  };
}

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
      post: {
        ...newPost._doc,
        user: req.user,
      },
    });
  },
  getPosts: async (req, res) => {
    const features = new APIfeatures(
      Posts.find({
        user: [...req.user.following, req.user._id],
      }),
      req.query
    ).paginating();
    const posts = await features.query
      .sort("-createdAt")
      .populate("user likes", "avatar userName fullName followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
    const counting = new APIfeatures(
      Posts.find({
        user: [...req.user.following, req.user._id],
      }),
      req.query
    ).counting();

    const result = await Promise.allSettled([posts, counting.query]);
    const p = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;
    if (!count) return sendError(res, "Không tìm thấy bài viết nào!");

    res.status(200).json({ msg: "Thành công!", result: count, posts: p });
  },
  uploadImg: async (req, res) => {
    let { file } = req;
    if (!file) return sendError(res, "File rỗng");
    const { public_id, url } = await cloudinary.uploader.upload(file.path, {
      height: 500,
      width: 500,
      folder: "instagram-clone",
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
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
    )
      .populate("user likes", "avatar userName fullName")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
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

    const like = await Posts.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );

    if (!like) return sendError(res, "Bài viết không tồn tại");

    return res.status(200).json({ msg: "" });
  },
  unLikePost: async (req, res) => {
    const unlike = await Posts.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    if (!unlike) return sendError(res, "Bài viết không tồn tại!");

    return res.status(200).json({ msg: "" });
  },
  getUserPosts: async (req, res) => {
    if (!isValidObjectId(req.params.id))
      return sendError(res, "Người dùng không hợp lệ!");

    const features = new APIfeatures(
      Posts.find({ user: req.params.id }),
      req.query
    ).paginating();

    const posts = features.query
      .sort("-createdAt")
      .populate("user likes", "avatar userName fullName")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
    const counting = new APIfeatures(
      Posts.find({ user: req.params.id }),
      req.query
    ).counting();

    const result = await Promise.allSettled([posts, counting.query]);
    const p = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;
    res.status(200).json({ posts: p, result: count });
  },
  getPostById: async (req, res) => {
    if (!isValidObjectId(req.params.id))
      return sendError(res, "Mã bài viết không hợp lệ!");
    const post = await Posts.findById(req.params.id)
      .populate("user likes", "avatar userName fullName")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
    return res.status(200).json({ post });
  },
  getPostsDicover: async (req, res) => {
    const features = new APIfeatures(
      Posts.find({
        user: { $nin: [...req.user.following, req.user._id] },
      }),
      req.query
    ).paginating();

    const posts = features.query.sort("-createdAt");

    const counting = new APIfeatures(
      Posts.find({
        user: { $nin: [...req.user.following, req.user._id] },
      }),
      req.query
    ).counting();

    const result = await Promise.allSettled([posts, counting.query]);
    const p = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    res.status(200).json({ msg: "Thành công!", result: count, posts: p });
  },
  deletePost: async (req, res) => {
    const post = await Posts.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!post) {
      return res.status(404).json({ msg: "Xóa bài viết thất bại!" });
    }
    await Comments.deleteMany({ _id: { $in: post.comments } });

    return res.status(200).json({ post, msg: "Xóa bài viết thành công!" });
  },
  savePost: async (req, res) => {
    const user = await Users.find({ _id: req.user_id, saved: req.params.id });
    if (user.length) return sendError(res, "Bạn đã lưu bài viết này!");

    const save = await Users.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $push: { saved: req.params.id },
      },
      { new: true }
    );

    if (!save) return sendError(res, "Người dùng không tồn tại");

    return res.status(200).json({ msg: "" });
  },
  unSavePost: async (req, res) => {
    const save = await Users.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { saved: req.params.id },
      },
      { new: true }
    );

    if (!save) return sendError(res, "Người dùng không tồn tại");

    return res.status(200).json({ msg: "" });
  },
  getSavePost: async (req, res) => {
    const features = new APIfeatures(
      Posts.find({ _id: { $in: req.user.saved } }),
      req.query
    ).paginating();
    const posts = features.query.sort("-createdAt");

    const counting = new APIfeatures(
      Posts.find({ _id: { $in: req.user.saved } }),
      req.query
    ).counting();

    const result = await Promise.allSettled([posts, counting.query]);
    const p = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    res.status(200).json({ msg: "Thành công!", result: count, posts: p });
  },
  getPostByAdmin: async (req, res) => {
    const posts = await Posts.find({})
      .sort("-createdAt")
      .populate("user likes", "avatar userName fullName followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
    return res.status(200).json({ posts });
  },
  deletePostByAdmin: async (req, res) => {
    const post = await Posts.findOneAndDelete({
      _id: req.params.id,
    });
    if (!post) {
      return res.status(404).json({ msg: "Xóa bài viết thất bại!" });
    }
    await Comments.deleteMany({ _id: { $in: post.comments } });

    return res.status(200).json({ post, msg: "Xóa bài viết thành công!" });
  }
};

module.exports = postCtrl;
