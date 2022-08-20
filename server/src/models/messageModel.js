const mongoose = require("mongoose");

const messageModel = new mongoose.Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: "conversation" },
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    recipient: { type: mongoose.Types.ObjectId, ref: "user" },
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageModel);
