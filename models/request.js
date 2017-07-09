const database = require('./database');
var classes_names;
database.getClassesNames(function (error, names) {
  if (error)
    return console.error(error);
  classes_names = names;
});
var locations_names;
database.getLocationsNames(function (error, names) {
  if (error)
    return console.error(error);
  locations_names = names;
})

function addRequest(requestInfo, callback) {
  //validate inputs
  if (!validate(requestInfo, callback))
    return;

  //insert into database
  database.insertRequest(requestInfo, callback);
}

function validate(toValidate, onErrorCall, isDBCall = false) {
  //check if required info wasn't provided.
  var required = ["fname", "lname", "class", "location"];
  if (isDBCall) {
    required.push("id");
  }

  required.forEach( function (r) {
    if (!toValidate[r]) {
      onErrorCall({
        status: "Failure",
        code: 400,
        failInfo: "Missing required information: " + r
      });
      return false;
    }
  });

  //check valid values
  if (!classes_names.includes(toValidate.class)) {
    onErrorCall({
      status: "Failure",
      code: 400,
      failInfo: "invalid class: " + toValidate.class
    });
    return false;
  }

  if (!locations_names.includes(toValidate.location)) {
    onErrorCall({
      status: "Failure",
      code: 400,
      failInfo: "invalid location: " + toValidate.location
    });
    return false;
  }

  if ("Remote" === toValidate.location)
    if (!toValidate.contact) {
      onErrorCall({
        status: "Failure",
        code: 400,
        failInfo: "Contact field is required if the location is marked as remote"
      });
      return false;
    }

  //check id if it is a database call
  if (isDBCall)
    if (!database.validate_id(toValidate.id, onErrorCall))
      return false;

  return true;
}

function editRequest(updatedInfo, callback) {
  //validate inputs
  if (!validate(updatedInfo, callback, true))
    return;

  //update database
  database.updateRequest(updatedInfo, callback);
}

function currentRequests(callback) {
  //grab the results from the database
  database.getAllRequests(callback);
}

function removeRequest(id, callback) {
  //check that the id is valid
  if (!database.validate_id(id, callback))
    return;

  //remove row in DB on current_requests where id and from the request table where request_id
  database.deleteRequest(id, callback);
}

module.exports = {
  addRequest: addRequest,
  editRequest: editRequest,
  currentRequests: currentRequests,
  removeRequest: removeRequest
};
