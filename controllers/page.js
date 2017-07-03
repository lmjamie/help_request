const modelPage = require('../models/page.js');

function renderQueue(request, response) {
  console.log("Rendering Help Queue.");
  modelPage.getRequestsAndServing(function (error, results) {
    if (error)
      return response.status(error.code).json(error); //change this to render and error page

    response.render("pages/queue", {
      serving: results.serving,
      requests: results.requests,
      class_names: results.class_names,
      location_names: results.location_names,
      helper: request.session.helper,
      student: request.session.student
      });
  });
}

module.exports = {
  renderQueue: renderQueue
};
