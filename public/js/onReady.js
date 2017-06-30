$("document").ready(function () {
  clocks = [];
  $(".clock").each(function (i) {
    var clockDiv = $(this);
    clocks[i] = clockDiv.FlipClock(parseInt(
      (Date.now() - clockDiv.attr("data-started")) / 60000), {
      clockFace: "Counter"
    });
    setTimeout(function () {
      setInterval(function () {
        clocks[i].increment();
      }, 60000);
    });
  });
});
