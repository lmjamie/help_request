const modelServe = require('../models/serve.js');

function handleServeRequest(request, response) {
  var cr_id = request.body.id;
  var helper_id = request.body.helper;
  console.log("Serve request for id:", cr_id, "With helper", helper_id);
  modelServe.serveRequest(cr_id, helper_id, function(error, result) {
    if (error)
      return response.status(400).json(error);
    response.json(result);
  });
}

function handleServingRequest(request, response) {
  console.log("Getting all Serving Requests");
  modelServe.servingRequests(function(error, results) {
    if (error)
      return response.status(400).json(error);
    response.json(results);
  });
}

function handleCompleteServe(request, response) {
  var id = request.params.id
  console.log("Completing serving the request with id:", id);
  modelServe.completeServe(id, function(error, results) {
    if (error)
      return response.status(400).json(error);
    response.json(results);
  });
}

module.exports = {
    handleServeRequest: handleServeRequest,
    handleServingRequest: handleServingRequest,
    handleCompleteServe: handleCompleteServe
};
