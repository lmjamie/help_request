const modelHelper = require("../models/helper.js");

function handleLogin(request, response) {
  var password = request.body.password,
      username = request.body.username;
  console.log("login attempt for with username:", username);
  modelHelper.login(username, password, function (error, result) {
    if (error)
      return response.status(error.code).json(error);
    request.session.helper = result.helper_id;
    response.json(result);
  })
}

function handleLogout(request, response) {
  if (!request.session.helper)
    return response.status(400).json({
      status: "Failure",
      failInfo: "Error logging out. Not Logged in."
    });
  request.session = null; // destroy the cookie session
  response.json({
    status: "Success",
    info: "Helper logged out"
  });
}

module.exports = {
  handleLogin: handleLogin,
  handleLogout: handleLogout
};
