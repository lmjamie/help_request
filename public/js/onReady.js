$("document").ready(function () {
  setupAllClocks();
  $(".modal").each(function () {
    $(this).modal();
  });
  $("#location").change(function () {
    if ($(this).val() == "Remote")
      $("#contact").prop("required", true);
    else
      $("#contact").prop("required", false);
  });
  $("#editlocation").change(function () {
    if ($(this).val() == "Remote")
      $("#editcontact").prop("required", true);
    else
      $("#editcontact").prop("required", false);
  });
});

function setupAllClocks() {
  clocks = {};
  setupServingClocks();
  setupCurrentClocks();
}

function setupServingClocks() {
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
