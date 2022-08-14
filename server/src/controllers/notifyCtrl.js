const Notifies = require("../models/notifyModel");

const notifyCtrl = {
  createNotify: async (req, res) => {
    const { id, recipients, url, text, content, image } = req.body;

    if (recipients.includes(req.user._id.toString())) return;

    const notify = new Notifies({
      id,
      recipients,
      url,
      text,
      content,
      image,
      user: req.user._id,
    });

    await notify.save();
    return res.status(200).json({ notify });
  },
  deleteNotify: async (req, res) => {
    const notify = await Notifies.findOneAndDelete({
      id: req.params.id,
      url: req.query.url,
    });
    return res.status(200).json({ notify });
  },
  getNotify: async (req, res) => {
    const notifies = await Notifies.find({ recipients: req.user._id })
      .sort("isRead")
      .populate("user", "avatar userName");
    return res.status(200).json({ notifies });
  },
  isRead: async (req, res) => {
    const notifies = await Notifies.findOneAndUpdate({_id: req.params.id},{
      isRead:true
    });
    return res.status(200).json({ notifies });
  },
  deleteAllNotifies: async (req, res) => {
    const notifies = await Notifies.deleteMany({recipients: req.user._id});
    return res.status(200).json({notifies})
  }
};

module.exports = notifyCtrl;
