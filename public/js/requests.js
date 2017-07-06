function login() {
  $("#login").modal("close");
  $.post({
    url: "/login",
    data: {
      username: $("#username").val(),
      password: $("#password").val()
    }
  }).done(function (data) {
    socket.emit("login", data.name);
    helper_id = data.helper_id;
    removeAdding(false);
    switchLoginLogoutBtns(true); // means switch to logout btn
    // This will make sure helper has permissions for the requests
    updateAllServing();
    updateAllCurrent();
    Materialize.toast("Successfully Logged in. Welcome " + data.name, 2000);
  }).fail(function (data) {
    data = data.responseJSON;
    Materialize.toast("Failed to Login: " + data.failInfo, 1500);
  });
}

function logout() {
  $.post("/logout").done(function () {
    socket.emit("logout");
    helper_id = false;
    allowToAdd();
    switchLoginLogoutBtns(false); // means switch to login btn
    updateAllServing();
    updateAllCurrent();
    Materialize.toast("Successfully Logged out.", 1500);
  }).fail(function (data) {
    data = data.responseJSON;
    Materialize.toast("Error: " + data.failInfo, 1500);
  });
}

function switchLoginLogoutBtns(login) {
  if (login)
    $("#loginbtn").replaceWith('<li id="logoutbtn"><a href="#" onclick="logout();">Logout<i class="' +
    'material-icons right">close</i></a></li>');
  else
    $("#logoutbtn").replaceWith('<li id="loginbtn"><a href="#login">Helper Login' +
    ' <i class="material-icons right">face</i></a></li>');
}

function servingClick(elem) {
  activeServe = elem;
  $("#serveConfirm").modal("open", {
    complete: function() {
      activeServe = null;
    }
  });
}

function helperCurrentClick(elem, nextInLine) {
  activeCurrent = elem;
  if (!nextInLine)
    $("#serveButton").addClass("disabled")
  $("#currentConfirm").modal("open", {
    complete: function () {
      var button = $("#serveButton");
      if (button.hasClass("disabled"))
        button.removeClass("disabled");
      activeCurrent = null;
  }});
}

function studentCurrentClick(elem) {
  activeCurrent = elem;
  $("#editCurrent").modal("open", {
    ready: function () {
      $("#editfname").val(activeCurrent.attr("data-fname"));
      $("#editlname").val(activeCurrent.attr("data-lname"));
      $("#editclass option[value='" + $("td:nth-child(2)", activeCurrent).text() + "']").prop("selected", true);
      $("#editlocation option[value='" + $("td:nth-child(3)", activeCurrent).text() + "']").prop("selected", true);
      $("#editdescription").text($("td:nth-child(4)", activeCurrent).text());
      $("#editcontact").val(activeCurrent.attr("data-contact"));
      Materialize.updateTextFields();
    },
    complete: function() {
      activeCurrent = null;
    }
  });
}

function updateAllServing() {
  $.get("/serving").done(function (data) {
    if (data.rows.length > 0) {
      var table_string = '<table class="responsive-table bordered"><thead><th>Name</th>' +
      '<th>Class</th><th>Location</th><th>Description</th>' +
      (helper_id ? '<th>Contact</th>' : '') + '<th>Helped By</th><th>Minutes</th></thead><tbody>';
      data.rows.forEach(function (s) {
        table_string += '<tr data-id="' + s.id  + '" data-helperid="' +
        s.helper_id + '"' + (helper_id ? ' onclick="servingClick($(this));"' : '') +
       '><td>' + s.r_fname + " " + s.r_lname + '<td>' + s.class + '</td><td>' +
       s.location + '</td><td>' + s.description + '</td>' +
       (helper_id ? '<td>' + s.contact + '</td>' : '') + '<td>' + s.h_fname + " " +
       s.h_lname + '</td><td><div class="clock" data-started="' + Date.parse(s.started) +
       '"></div></td></tr>';
      });
      table_string += "</tbody></table>";
      $("#serving").html(table_string);
      setupServingClocks();
    } else
      $("#serving").html("<span>Currently no one is being served.</span>");
    checkIfCompletedOrRemoved();
  });
}

function checkIfCompletedOrRemoved() {
  if (student_id)
    if(!$("tr[data-id=" + student_id + "]").length) {
      allowToAdd();
      cleanUp();
    }
}

function cleanUp() {
  $.ajax({
    method: "DELETE",
    url: "/request/session"
  }).done(function (data) {
    Materialize.toast("Your help request has been completed!", 1750);
  }).fail(function (data) {
    data = data.responseJSON;
    Materialize.toast("Error: " + data.failInfo, 1500);
  });
}

function updateAllCurrent() {
  $.get("/requests").done(function (data) {
    if (data.rows.length > 0) {
      var table_string =  '<table class="responsive-table bordered"><thead><th>Name</th>' +
      '<th>Class</th><th>Location</th><th>Description</th>' +
      (helper_id ? '<th>Contact</th>' : '') + '<th>Minutes</th></thead><tbody>';
      data.rows.forEach(function (r, i) {
        table_string += '<tr data-id="' + r.id + '" data-contact="' + r.contact +
        '"' + (helper_id ? 'onclick="helperCurrentClick($(this), ' + (i == 0) +
        ');"' : (r.id == student_id ? 'onclick="studentCurrentClick($(this));"' : '')) +
        '><td>' + r.fname + " " + r.lname + '</td><td>' + r.class + '</td><td>' +
        r.location + '</td><td>' + r.description + '</td>' +
        (helper_id ? '<td>' + r.contact + '</td>' : '') +
        '<td><div class="clock" data-started="' + Date.parse(r.started) +
        '"></div></td></tr>';
      });
      table_string += "</tbody></table>";
      $("#current").html(table_string);
      setupCurrentClocks();
    } else
      $("#current").html("<span>No one is currently waiting for help.</span>");
    checkIfCompletedOrRemoved();
  });
}

function serveCurrent() {
  $("#currentConfirm").modal("close");
  $.ajax({
    method: "PUT",
    url: "/serve",
    data: {
      id: activeCurrent.attr("data-id"),
      helper: helper_id
    }
  }).done(function () {
    var name = $("td", activeCurrent).first().text();
    socket.emit("serving change");
    socket.emit("current change");
    updateAllServing();
    updateAllCurrent();
    Materialize.toast("Now serving " + name, 1500);
  }).fail(function (data) {
    data = data.responseJSON;
    Materialize.toast("Error: " + data.failInfo, 1500);
  });
  return false;
}

function completeServing() {
  $("#serveConfirm").modal("close");
  $.ajax({
    method: "DELETE",
    url: "/serve/" + activeServe.attr("data-id")
  }).done(function () {
    var name = $("td", activeServe).first().text();
    socket.emit("serving change");
    updateAllServing();
    Materialize.toast("Completed helping " + name, 1500);
  }).fail(function (data) {
    data = data.responseJSON;
    Materialize.toast("Error: " + data.failInfo, 1500);
  });
  return false;  // To not follow the link
}

function allowToAdd() {
  student_id = null;
  $("#nav-list").prepend('<li id="addbtn"><a href="#addCurrent">' +
  'Request Help <i class="material-icons right">live_help</i></a></li>');
  $("main").append('<div class="fixed-action-btn click-to-toggle" id="addfab">' +
  '<a href="#addCurrent" class="btn-floating blue darken-1">' +
  '<i class="material-icons">live_help</i></a></div>');
}

function removeAdding(sid) {
  student_id = sid;
  $("#addbtn").remove();
  $("#addfab").remove();
}

function addCurrent() {
  $("#addCurrent").modal("close");
  $.ajax({
    method: "PUT",
    url: "/request",
    data: {
      fname: $("#fname").val(),
      lname: $("#lname").val(),
      class: $("#class").val(),
      location: $("#location").val(),
      description: $("#description").val(),
      contact: $("#contact").val()
    }
  }).done(function (data) {
    var name = $("#fname").val() + " " + $("#lname").val();
    socket.emit("current change");
    socket.emit("new request", name);
    updateAllCurrent();
    removeAdding(data.newRequestId);
    Materialize.toast("Added help request for " + name, 1500);
  }).fail(function (data) {
    data = data.responseJSON;
    Materialize.toast("Error: " + data.failInfo, 1500);
  });
}

function removeCurrent(modal_id) {
  $("#" + modal_id).modal("close");
  $.ajax({
    method: "DELETE",
    url: "/request/" + activeCurrent.attr("data-id")
  }).done(function () {
    var name = $("td", activeCurrent).first().text();
    socket.emit("current change");
    updateAllCurrent();
    if (modal_id == "editCurrent")
      allowToAdd();
    Materialize.toast("Removed " + name + " from the queue", 1500);
  }).fail(function (data) {
    data = data.responseJSON;
    Materialize.toast("Error: " + data.failInfo, 1500);
  });
  return false;
}

function updateCurrent() {
  $("#editCurrent").modal("close");
  $.post({
    url: "/request",
    data: {
      id: activeCurrent.attr("data-id"),
      fname: $("#editfname").val(),
      lname: $("#editlname").val(),
      class: $("#editclass").val(),
      location: $("#editlocation").val(),
      description: $("#editdescription").val(),
      contact: $("#editcontact").val()
    }
  }).done(function () {
    var name = $("td", activeCurrent).first().text();
    socket.emit("current change");
    updateAllCurrent();
    Materialize.toast("Updated request for " + name, 1500);
  }).fail(function (data) {
    data = data.responseJSON;
    Materialize.toast("Error: " + data.failInfo, 1500);
  });
}

function requestNotfication(name) {
  Materialize.toast("<span>" + name + " has requested help</span>" +
  "<audio src=\"sounds/new_request_sound.mp3\" autoplay></audio>", 2250);
}
