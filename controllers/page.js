const modelPage = require('../models/page.js');

function renderQueue(request, response) {
  modelPage.getRequestsAndServing(function (error, results) {
    if (error)
      return response.status(error.code).json(error); //change this to render and error page

    response.render("pages/queue", {
      serving: results.serving,
      requests: results.requests,
      class_names: results.class_names,
      location_names: results.location_names,
      helper: request.session.helper || false,
      student: request.session.student || false
      });
  });
}

module.exports = {
  renderQueue: renderQueue
};
