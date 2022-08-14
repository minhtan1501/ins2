let users = [];

const SocketServer = (socket) => {
  // connect - disconnect
  socket.on("joinUser", (id) => {
    users.push({ id, socketId: socket.id });
  });
  socket.on("disconnect", () => {
    users = users.filter((user) => user.sockedId !== socket.id);
  });

  // lịke
  socket.on("likePost", (newPost) => {
    const ids = [...newPost.user?.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("likeToClient", newPost);
      });
    }
  });
  // unlike
  socket.on("unLikePost", (newPost) => {
    const ids = [...newPost.user?.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("unLikeToClient", newPost);
      });
    }
  });
  // createComment
  socket.on("createComment", (newPost) => {
    const ids = [...newPost.user?.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createCommentToClient", newPost);
      });
    }
  });
  //deleteComment
  socket.on("deleteComment", (newPost) => {
    const ids = [...newPost.user?.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("deleteCommentToClient", newPost);
      });
    }
  });
  // follow

  socket.on("follow", (newProfile) => {
    users.forEach((client) => {
      socket.to(`${client.socketId}`).emit("followToClient", newProfile);
    });
  });
  socket.on("unFollow", (newProfile) => {
    users.forEach((client) => {
      socket.to(`${client.socketId}`).emit("unFollowToClient", newProfile);
    });
  });

  socket.on("createNotify", (msg) => {
    const client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("createNotifyToClient", msg);
  });
  socket.on("deleteNotify", (msg) => {
    const client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("deleteNotifyToClient", msg);
  });
};

module.exports = SocketServer;
