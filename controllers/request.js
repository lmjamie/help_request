const modelRequest = require('../models/request.js');

function handleAddRequest(request, response) {
  var requestInfo = request.body;
  console.log("Adding Request:", requestInfo);
  modelRequest.addRequest(requestInfo, function(error, result) {
    if (error)
      return response.status(error.code).json(error);
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
    response.json(result);
  });
}

module.exports = {
  handleAddRequest: handleAddRequest,
  handleEditRequest: handleEditRequest,
  handleCurrentRequests: handleCurrentRequests,
  handleRemoveRequest: handleRemoveRequest
};
