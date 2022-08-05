const { isValidObjectId } = require("mongoose");
const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");
const { sendError } = require("../utils/helper");

const commentCtrl = {
  createComment: async (req, res) => {
    const { postId, content, tag, reply } = req.body;

    const newComment = new Comments({
      user: req.user._id,
      content,
      tag,
      reply,
    });

    await Posts.findOneAndUpdate(
      { _id: postId },
      {
        $push: { comments: newComment._id },
      },
      { new: true }
    );

    await newComment.save();

    res.status(200).json({ newComment });
  },
  updateComment: async (req, res) => {
    const { content } = req.body;
   const comment =  await Comments.findOneAndUpdate({
      _id: req.params.id, user: req.user._id
  }, {content})

    if(!comment) return sendError(res, "Cập nhật thất bại");

    res.status(200).json({ msg: "Cập nhật thành công"});
  },
  likeComment: async (req, res) => {
    const comment = await Comments.find({ _id: req.params.id, likes: req.user._id });
    if (comment.length) return sendError(res, "Bạn đã bình luận bài viết này!");

    await Comments.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );

    return res.status(200).json({ msg: "" });
  },
  unLikeComment: async (req, res) => {
    await Comments.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    return res.status(200).json({ msg: "" });
  },
  deleteComment: async (req, res) => {
    if(!isValidObjectId(req.params.id)) return sendError(res,'Xóa bình luận thất bại!');
    const comment =  await Comments.findByIdAndDelete(req.params.id);
    if(!comment) return sendError(res,'Xóa bình luận thất bại!');  

    return res.status(200).json({ msg: "Xóa bình luận thành công" });
  },
  
};

module.exports = commentCtrl;
