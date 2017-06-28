const database = require('./database');

function getRequestsAndServing(callback) {
  database.getAllServing(function (sError, sResult) {
    if (sError)
      return callback(sError);
    database.getAllRequests(function (cError, cResult) {
      if (cError)
        return callback(cError);
      callback(null, {
        status: "Success",
        info: "Retrived both requests and serving",
        serving: sResult.rows,
        requests: cResult.rows
      });
    });
  });
}

module.exports = {
  getRequestsAndServing: getRequestsAndServing
};
