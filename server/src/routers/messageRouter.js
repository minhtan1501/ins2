const router = require("express").Router();
const messageCtrl = require("../controllers/messageCtrl");
const { auth } = require("../middleware/auth");

router.post("/message", auth, messageCtrl.createMessage);

router.get("/conversations", auth, messageCtrl.getConversation);

router.get("/message/:id", auth, messageCtrl.getMessage);

router.delete("/message/:id", auth, messageCtrl.deleteMessage);

router.delete("/conversation/:id", auth, messageCtrl.deleteConversation);


module.exports = router;
