$("document").ready(function () {
  // Clock setup
  setupAllClocks();

  // Modal intitializing
  $(".modal").each(function () {
    $(this).modal();
  });

  // on change event for add Request
  $("#location").change(function () {
    if ($(this).val() == "Remote")
      $("#contact").prop("required", true);
    else
      $("#contact").prop("required", false);
  });

  // on change event for edit current
  $("#editlocation").change(function () {
    if ($(this).val() == "Remote")
      $("#editcontact").prop("required", true);
    else
      $("#editcontact").prop("required", false);
  });

  // Socket.io events
  socket.on("current change", updateAllCurrent);
  socket.on("serving change", updateAllServing);
  socket.on("new request", requestNotfication);
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
