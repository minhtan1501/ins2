const { isValidObjectId } = require("mongoose");
const User = require("../models/userModel");
const Conversations = require("../models/conversationModel");
const Messages = require("../models/messageModel");
const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const { sendError } = require("../utils/helper");
const userCtrl = {
  searchUser: async (req, res) => {
    const { username } = req.query;
    const users = await User.find({
      userName: { $regex: username, $options: "i" },
    })
      .limit(10)
      .select("fullName userName avatar");
    return res.status(200).json({ result: users });
  },
  getUser: async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, "Người dùng không hợp lệ");

    const user = await User.findById(id)
      .select("-password")
      .populate("followers following", "-password");
    if (!user) return sendError(res, "Không tìm thấy người dùng");

    return res.status(200).json({ profile: user });
  },
  updateUser: async (req, res) => {
    const { avatar, fullName, mobile, address, story, website, gender } =
      req.body;

    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        avatar,
        fullName,
        mobile,
        address,
        story,
        website,
        gender,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: "Cập nhật thông tin thành công", result: user });
  },
  follow: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return sendError(res, "Người dùng không hợp lệ!");
    const user = await User.find({ _id: id, followers: req.user._id });
    if (user.length > 0)
      return sendError(res, "Bạn đã theo dõi người dùng này rồi!");

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { following: id },
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: id },
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );

    res.status(200).json({ msg: "Theo dõi thành công!" });
  },
  unFollow: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return sendError(res, "Người dùng không hợp lệ!");

    await User.findOneAndUpdate(
      { _id: id },
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { following: id },
      },
      { new: true }
    );

    res.status(200).json({ msg: " Huỷ theo dõi thành công!" });
  },
  suggestionsUser: async (req, res) => {
    const newArr = [...req.user.following, req.user._id];

    const num = req.query.num || 10;

    const users = await User.aggregate([
      { $match: { _id: { $nin: newArr } } },
      { $sample: { size: num } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "following",
        },
      },
    ]).project("-password");

    return res.status(200).json({ users, result: users.length });
  },
  getAllUsers: async (req, res) => {
    const users = await User.find({ _id: { $nin: [req.user._id] } });
    return res.status(200).json({ users });
  },
  banUser: async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      {
        isBanner: true,
      },
      { new: true }
    );
    if (!user) return sendError(res, "Chặn người dùng thất bại");

    return res.status(200).json({ msg: "Chặn người dùng thành công", user });
  },
  unBanUser: async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      {
        isBanner: false,
      },
      { new: true }
    );
    if (!user) return sendError(res, "Mở khóa người dùng thất bại");

    return res.status(200).json({ msg: "Mở khóa người dùng thành công", user });
  },
  deleteUserByAdmin: async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return sendError(res, "Xóa người dùng thất bại");
    console.log(user)
    const newConversation = await Conversations.deleteMany({
      recipients: { $in: [id] },
    });

    await Messages.deleteMany({
      $or: [{ sender: id }, { recipient: id }],
    });

    await Posts.deleteMany({
      user: id,
    });

    await Comments.deleteMany({
      user: id,
    });

    return res.status(200).json({ msg: "Xóa thành công", user });
  },
};

module.exports = userCtrl;
