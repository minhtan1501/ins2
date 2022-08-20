const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
const commentRouter = require("./commentRouter");
const notifyRouter = require("./notifyRouter");
const messageRouter = require("./messageRouter");
const router = (app) => {
  app.use("/api", authRouter);
  app.use("/api", userRouter);
  app.use("/api", postRouter);
  app.use("/api", commentRouter);
  app.use("/api", notifyRouter);
  app.use("/api", messageRouter);
};

module.exports = router;
