const router = require("express").Router();
const notifyCtrl = require("../controllers/notifyCtrl");
const { auth } = require("../middleware/auth");

router.post("/notify", auth, notifyCtrl.createNotify);

router.delete("/notify/:id", auth, notifyCtrl.deleteNotify);

router.get("/notifies", auth, notifyCtrl.getNotify);

router.patch("/isReadNotify/:id", auth, notifyCtrl.isReadNotifies);

router.delete("/deleteAllNotify", auth, notifyCtrl.deleteAllNotifies);

module.exports = router;
