const modelRequest = require('../models/request.js');

function handleAddRequest(request, response) {
  var requestInfo = request.body;
  console.log("Adding Request:", requestInfo);
  modelRequest.addRequest(requestInfo, function(error, result) {
    if (error)
      return response.status(error.code).json(error);
    request.session.student = result.newRequestId;
    response.json(result);
  });
}

function handleEditRequest(request, response) {
  var updatedInfo = request.body;
  console.log("Editing Request for:", updatedInfo);
  modelRequest.editRequest(updatedInfo, function(error, result) {
    if (error)
      return response.status(error.code).json(error);
    response.json(result);
  });
}

function handleCurrentRequests(request, response) {
  console.log("Getting all current Requests!");
  modelRequest.currentRequests(function(error, result) {
    if (error)
      return response.status(error.code).json(error);
    response.json(result);
  });
}

function handleRemoveRequest(request, response) {
  var id =  request.params.id;
  console.log("Delete Request with id:", id);
  modelRequest.removeRequest(id, function(error, result) {
    if (error)
      return response.status(error.code).json(error);
    if (request.session.student)
      request.session = null;
    response.json(result);
  });
}

function handleCleanUp(request, response) {
  if (!request.session.student)
    return response.status(400).json({
      status: "Failure",
      failInfo: "No student session to remove."
    });
  request.session = null; // destroy the cookie session
  response.json({
    status: "Success",
    info: "Session removed"
  });
}

module.exports = {
  handleAddRequest: handleAddRequest,
  handleEditRequest: handleEditRequest,
  handleCurrentRequests: handleCurrentRequests,
  handleRemoveRequest: handleRemoveRequest,
  handleCleanUp: handleCleanUp
};
