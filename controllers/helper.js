const modelHelper = require("../models/helper.js");

function handleLogin(request, response) {
  var password = request.body.password,
      username = request.body.username;
  console.log("login attempt for with username:", username);
  modelHelper.login(username, password, function (error, result) {
    if (error)
      response.status(error.code).json(error);
      request.session.  
  })
}

function handleLogout(request, response) {

}

module.exports = {
  handleLogin: handleLogin,
  handleLogout: handleLogout
};
