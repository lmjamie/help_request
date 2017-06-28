const modelPage = require('../models/page.js');

function renderQueue(request, response) {
  console.log("Rendering Help Queue.");
  modelPage.getRequestsAndServing(function (error, results) {
    if (error)
      return response.status(error.code).json(error); //change this to render and error page

    response.render("pages/queue", {
      serving: results.serving,
      requests: results.requests});
    // response.send(results); //testing
  });
}

module.exports = {
  renderQueue: renderQueue
};
