function handleConnection(socket) {
  console.log("A user has connected");

  socket.on("login", function (name) {
    if (name)
      console.log("Helper", name, "has logged in.");
    else
      console.log("A helper has refreshed.");
    socket.join("helpers");
  });

  socket.on("logout", function () {
    console.log("A helper has been logged out:");
    socket.leave("helpers");
  });

  socket.on("new request", function (info) {
    console.log(info.name, "has requested help for", info.class + "!");
    socket.to("helpers").emit("new request", info);
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
