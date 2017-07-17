$("document").ready(function () {
  // Clock setup
  setupAllClocks();

  // Modal intitializing
  $(".modal").each(function () {
    $(this).modal();
  });

  // Select intitializing
  $("#addCurrent select").each(function () {
    $(this).material_select();
  });

  // Socket.io events
  socket.on("current change", updateAllCurrent);
  socket.on("serving change", updateAllServing);
  socket.on("new request", requestNotfication);

  // Check if things have been Removed
  checkIfCompletedOrRemoved();

  // Make sure to keep a helper who is already logged in in the helper room
  if (helper_id)
    socket.emit("login", false);
});

function setupAllClocks() {
  clocks = {};
  setupServingClocks();
  setupCurrentClocks();
}

function setupServingClocks() {
  if (typeof clocks.serInc !== 'undefined')
    clocks.serInc.forEach(function (s) {
      clearInterval(s);
    });
  clocks.serving = [];
  clocks.serInc = [];
  $("#serving .clock").each(function (i) {
    var clockDiv = $(this);
    clocks.serving[i] = clockDiv.FlipClock(parseInt(
      (Date.now() - clockDiv.attr("data-started")) / 60000), {
      clockFace: "Counter"
    });
    setInterval(function () {
      clocks.serInc[i] = clocks.serving[i].increment();
    }, 60000);
  });
}

function setupCurrentClocks() {
  if (typeof clocks.curInc !== 'undefined')
    clocks.curInc.forEach(function (c) {
      clearInterval(c);
    });
  clocks.current = [];
  clocks.curInc = [];
  $("#current .clock").each(function (i) {
    var clockDiv = $(this);
    clocks.current[i] = clockDiv.FlipClock(parseInt(
      (Date.now() - clockDiv.attr("data-started")) / 60000), {
      clockFace: "Counter"
    });
    setInterval(function () {
      clocks.curInc[i] = clocks.current[i].increment();
    }, 60000);
  });
}
