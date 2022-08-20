const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const { auth, authAdmin } = require("../middleware/auth");

router.get("/search", auth, userCtrl.searchUser);

router.get("/user/:id", auth, userCtrl.getUser);

router.patch("/user", auth, userCtrl.updateUser);

router.patch("/user/:id/follow", auth, userCtrl.follow);

router.patch("/user/:id/unfollow", auth, userCtrl.unFollow);

router.get("/suggestions-user", auth, userCtrl.suggestionsUser);

router.get("/get-all-users", auth, authAdmin, userCtrl.getAllUsers);

router.patch("/ban-user/:id/", auth, authAdmin, userCtrl.banUser);

router.patch("/unban-user/:id/", auth, authAdmin, userCtrl.unBanUser);

router.delete("/user-admin/:id", auth, authAdmin, userCtrl.deleteUserByAdmin);

module.exports = router;
