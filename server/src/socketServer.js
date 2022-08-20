let users = [];

const SocketServer = (socket) => {
  // connect - disconnect
  socket.on("joinUser", (user) => {
    users.push({
      id: user._id,
      socketId: socket.id,
      followers: user.followers,
    });
  });
  socket.on("disconnect", () => {
    const data = users.find((user) => user.socketId === socket.id);
    if (data) {
      const clients = users.filter((user) =>
        data.followers.find((item) => item._id === user.id)
      );
      if (clients.length > 0) {
        clients.forEach((client) => {
          socket.to(`${client.socketId}`).emit("CheckUserOffline", data.id);
        });
      }
    }

    users = users.filter((user) => user.socketId !== socket.id);
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
  // notification
  socket.on("createNotify", (msg) => {
    const client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("createNotifyToClient", msg);
  });
  socket.on("deleteNotify", (msg) => {
    const client = users.find((user) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("deleteNotifyToClient", msg);
  });

  // message
  socket.on("addMessage", (msg) => {
    const user = users.find((user) => user.id === msg.recipient);
    user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
  });
  // check user online/offline

  socket.on("checkUserOnline", (data) => {
    const following = users.filter((user) => {
      return data.following.find((item) => item._id === user.id);
    });

    socket.emit("checkUserOnlineToMe", following);

    const clients = users.filter((user) =>
      data.followers.find((i) => i._id === user.id)
    );

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket
          .to(`${client.socketId}`)
          .emit("checkUserOnlineToClient", data._id);
      });
    }
  });
};

module.exports = SocketServer;
