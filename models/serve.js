const database = require('./database');

function serveRequest(cr_id, helper_id, callback) {
  //check if the id is valid
  var ids = [cr_id, helper_id];
  for (var i = 0; i < ids.length; ++i)
    if (!database.validate_id(ids[i], callback))
      return;

  //transfer the information to the serving table, and delete from the current
  database.serveRequest(cr_id, helper_id, callback)
}

function servingRequests(callback) {
  //grab the results from the database
  database.getAllServing(callback);
}

function completeServe(id, callback) {
  //validate the id
  if (!database.validate_id(id, callback))
    return;

  // delete the row in serving_requests and requests that matches.
  database.deleteServe(id, callback);
}

module.exports = {
  serveRequest: serveRequest,
  servingRequests: servingRequests,
  completeServe: completeServe
};
