const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
const commentRouter = require("./commentRouter");
const router = (app) => {
  app.use("/api", authRouter);
  app.use("/api", userRouter);
  app.use("/api", postRouter);
  app.use("/api", commentRouter);
};

module.exports = router;
