const modelPage = require('../models/page.js');

function renderQueue(request, response) {
  console.log("Rendering Help Queue.");
  modelPage(function (error, results) {
    if (error)
      return response.status(error.code).json(error);
  })
}


module.exports = {
  renderQueue: renderQueue
};
