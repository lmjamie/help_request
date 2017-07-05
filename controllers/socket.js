function handleConnection(socket) {
  console.log("A user has connected");

  socket.on("login", function (info) {
      console.log("Helper", info.name, "has logged in.");
      socket.join("helpers");
  });

  socket.on("logout", function () {
    console.log("A helper has been logged out:");
    socket.leave("helpers");
  });

  socket.on("current change", function () {
    console.log("Current requests have been updated.");
    socket.broadcast.emit("current change");
  });

  socket.on("serving change", function () {
    console.log("Serving requests have been updated.");
    socket.broadcast.emit("serving change");
  });

  socket.on("disconnect", function () {
    console.log("A user has disconnected");
  });
}

module.exports = {
  handleConnection: handleConnection
};
