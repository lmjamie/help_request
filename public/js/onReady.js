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
});

function setupAllClocks() {
  clocks = {};
  setupServingClocks();
  setupCurrentClocks();
}

function setupServingClocks() {
  if (typeof clocks.serving !== 'undefined')
    clocks.serving.forEach(function (s) {
      s.stop();
    });
  clocks.serving = [];
  $("#serving .clock").each(function (i) {
    var clockDiv = $(this);
    clocks.serving[i] = clockDiv.FlipClock(parseInt(
      (Date.now() - clockDiv.attr("data-started")) / 60000), {
      clockFace: "Counter"
    });
    setTimeout(function () {
      setInterval(function () {
        clocks.serving[i].increment();
      }, 60000);
    });
  });
}

function setupCurrentClocks() {
  if (typeof clocks.current !== 'undefined')
    clocks.current.forEach(function (c) {
      c.stop();
    });
  clocks.current = [];
  $("#current .clock").each(function (i) {
    var clockDiv = $(this);
    clocks.current[i] = clockDiv.FlipClock(parseInt(
      (Date.now() - clockDiv.attr("data-started")) / 60000), {
      clockFace: "Counter"
    });
    setTimeout(function () {
      setInterval(function () {
        clocks.current[i].increment();
      }, 60000);
    });
  });
}
