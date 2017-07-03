const database = require('./database');

function getRequestsAndServing(callback) {
  database.getAllServing(function (sError, sResult) {
    if (sError)
      return callback(sError);
    database.getAllRequests(function (cError, cResult) {
      if (cError)
        return callback(cError);
      database.getClassesNames(function (cnError, cnResult) {
        if (cnError)
          return callback(cnError);
        database.getLocationsNames(function (lError, lResult) {
          if (lError)
            return callback(lError);
          callback(null, {
            status: "Success",
            info: "Retrived both requests and serving",
            serving: sResult.rows,
            requests: cResult.rows,
            class_names: cnResult,
            location_names: lResult
          });
        });
      });
    });
  });
}

module.exports = {
  getRequestsAndServing: getRequestsAndServing
};
