const Conversations = require("../models/conversationModel");
const Messages = require("../models/messageModel");

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

const messageCtrl = {
  createMessage: async (req, res) => {
    const { recipient, text, media } = req.body;

    if (!recipient || (!text.trim() && media.length === 0)) {
      return;
    }

    const newConversation = await Conversations.findOneAndUpdate(
      {
        $or: [
          { recipients: [req.user._id, recipient] },
          { recipients: [recipient, req.user._id] },
        ],
      },
      {
        recipients: [req.user._id, recipient],
        text,
        recipient,
      },
      { new: true, upsert: true }
    );

    const newMessage = new Messages({
      conversation: newConversation._id,
      sender: req.user._id,
      recipient,
      text,
      media,
    });

    await newMessage.save();

    res.status(200).json({ newConversation });
  },
  getConversation: async (req, res) => {
    const features = new APIfeatures(
      Conversations.find({
        recipients: req.user._id,
      }),
      req.query
    ).paginating();

    const conversations = features.query
      .sort("-updatedAt")
      .populate("recipients", "avatar userName fullName");

    const counting = new APIfeatures(
      Conversations.find({
        recipients: req.user._id,
      }),
      req.query
    ).counting();

    const result = await Promise.allSettled([conversations, counting.query]);
    const c = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    res.status(200).json({ result: count, conversations: c });
  },
  getMessage: async (req, res) => {
    const features = new APIfeatures(
      Messages.find({
        $or: [
          { sender: req.user.id, recipient: req.params.id },
          { sender: req.params.id, recipient: req.user.id },
        ],
      }).sort("-createdAt"),
      req.query
    ).paginating();

    const messages = features.query.populate(
      "recipient",
      "avatar userName fullName"
    );

    const counting = new APIfeatures(
      Messages.find({
        $or: [
          { sender: req.user._id, recipient: req.params.id },
          { sender: req.params.id, recipient: req.user._id },
        ],
      }),
      req.query
    ).counting();

    const result = await Promise.allSettled([messages, counting.query]);
    const m = result[0].status === "fulfilled" ? result[0].value : [];
    const count = result[1].status === "fulfilled" ? result[1].value : 0;

    res.status(200).json({ result: count, messages: m.reverse() });
  },
  deleteMessage: async (req, res) => {
    await Messages.findOneAndDelete({
      _id: req.params.id,
      sender: req.user._id,
    });
    res.status(200).json({ msg: "Xóa thành công" });
  },
  deleteConversation: async (req, res) => {
    const newConversation = await Conversations.findOneAndDelete({
      $or: [
        {recipients:[req.user._id, req.params.id]},
        { recipients:[req.params.id, req.user._id]}
      ]
    });

    await Messages.deleteMany({conversation: newConversation._id})


    res.status(200).json({ msg: "Xóa thành công" });
  },
};

module.exports = messageCtrl;
