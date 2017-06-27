const pg = require('pg');
if (!process.env.LOCAL)
  pg.defaults.ssl = true;
const { Pool } = pg;
const pool = new Pool({
  connectionString: (process.env.DATABASE_URL)
});

function validate_id(id, onErrorCall) {
  //matches digits only from beginning to end of string
  if (!/^\d+$/.test(id)) {
    onErrorCall({
      status: "Failure",
      failInfo: "invalid id provided: " + id
    });
    return false;
  }
  return true;
}

function insertRequest(requestInfo, callback) {
  //in case of error midway;
  var failed = false;

  //insert request and get id.
  pool.query({
    name: "insert-request",
    text: "INSERT INTO requests(fname, lname, class_id, description, email, " +
    "location_id) " + "SELECT $1, $2, c.id, $4, $5, l.id FROM classes c, " +
    "locations l WHERE c.name = $3 AND l.name = $6 RETURNING id",
    values: [
      requestInfo.fname, requestInfo.lname, requestInfo.class,
      requestInfo.description, requestInfo.email, requestInfo.location
    ]
  }, function (error, result) {
    if (error) {
      console.error(error);
      return callback({
        status: "Failure",
        failInfo: "Failed to insert request"
      });
    }
    new_request_id = result.rows[0].id;

    //insert into current_requests
    pool.query({
      name: "insert-current",
      text: "INSERT INTO current_requests(request_id) VALUES($1)",
      values: [new_request_id]
    }, function (error, result) {
      if (error) {
        console.error(error);
        return callback({
          status: "Failure",
          failInfo: "Failed to insert current request"
        });
      }
      callback(null, {
        status: "Success",
        newRequestId: new_request_id
      });
    });
  });

}

function updateRequest(updatedInfo, callback) {
  pool.query({
    name: "update-request",
    text: "UPDATE requests SET fname = $2, lname = $3, class_id = c.id, " +
    "description = $5, email = $6, location_id = l.id FROM classes c, " +
    "locations l WHERE requests.id = $1 AND c.name = $3 AND l.name = $7",
    values: [
      updatedInfo.id, updatedInfo.fname, updatedInfo.lname, updatedInfo.class,
      updatedInfo.description, updatedInfo.email, updatedInfo.location
    ]
  }, function (error, result) {
    if (error) {
      console.error(error);
      return callback({
        status: "Failure",
        failInfo: "Failed to updated request with id: " + updatedInfo.id
      });
    }
    callback(null, {
      status: "Success",
      info: "Request was updated."
    });
  });
}

function getAllRequests(callback) {
  pool.query({
    name: "fetch-all-requests",
    text: "SELECT r.id, r.fname, r.lname, c.name AS class, r.description, r.email, " +
    "l.name AS location, cr.started FROM requests r JOIN classes c ON r.class_id " +
    "= c.id JOIN locations l ON r.location_id = l.id JOIN current_requests cr ON " +
    "r.id = cr.request_id ORDER BY cr.started"
  }, function (error, result) {
    if (error) {
      console.error(error);
      return callback({
        status: "Failure",
        failInfo: "Failed to retreive requests"
      });
    }
    callback(null, {
      status: "Success",
      info: "Retrieved all requests.",
      rows: result.rows
    });
  });
}

function deleteRequest(id, callback) {
  //remove current request
  pool.query({
    name: "remove-current-request",
    text: "DELETE FROM current_requests WHERE request_id = $1",
    values: [id]
  }, function (error, result) {
    if (error) {
      console.error(error);
      return callback({
        status: "Failure",
        failInfo: "Failed to delete current request"
      });
    }

    //remove the request
    pool.query({
      name: "remove-request",
      text: "DELETE FROM requests WHERE id = $1",
      values: id
    }, function (error, result) {
      if (error) {
        console.error(error);
        return callback({
          status: "Failure",
          failInfo: "Failed to delete requests"
        });
      }
      callback(null, {
        status: "Success",
        info: "Deleted request.",
      });
    });
  });
}

function serveRequest(id, helper_id, callback) {
  //remove from current request
  pool.query({
    name: "remove-current-request",
    text: "DELETE FROM current_requests WHERE request_id = $1",
    values: [id]
  }, function (error, result) {
    if (error) {
      console.error(error);
      return callback({
        status: "Failure",
        failInfo: "Failed to delete current request"
      });
    }

    //insert into the serving_requests
    pool.query({
      name: "insert-serving",
      text:"INSERT INTO serving_requests(request_id, helper_id) VALUES($1, $2)",
      values: [id, helper_id]
    }, function (error, result) {
      if (error) {
        console.error(error);
        return callback({
          status: "Failure",
          failInfo: "Failed to insert serving request"
        });
      }
      callback(null, {
        status: "Success",
        info: "Inserted request into serving requests",
      });
    });
  });
}

function getAllServing(callback) {
  pool.query({
    name: "fetch-all-serving",
    text: "SELECT r.id, r.fname AS r_fname, r.lname r_lname, c.name AS class," +
    " r.description, r.email, l.name AS location, sr.helper_id, h.fname AS " +
    "h_fname, h.lname AS h_lname, sr.started FROM requests r JOIN classes c ON " +
    "r.class_id = c.id JOIN locations l ON r.location_id = l.id JOIN " +
    "serving_requests sr ON r.id = sr.request_id JOIN helpers h ON sr.helper_id" +
    " = h.id ORDER BY sr.started"
  }, function (error, result) {
    if (error) {
      console.error(error);
      return callback({
        status: "Failure",
        failInfo: "Failed to retreive serving requests"
      });
    }
    callback(null, {
      status: "Success",
      info: "Retrieved all serving requests.",
      rows: result.rows
    });
  });
}

function deleteServe(id, callback) {
  //remove serving request
  pool.query({
    name: "remove-serving-request",
    text: "DELETE FROM serving_requests WHERE request_id = $1",
    values: [id]
  }, function (error, result) {
    if (error) {
      console.error(error);
      return callback({
        status: "Failure",
        failInfo: "Failed to delete serving request"
      });
    }
    //remove the request
    pool.query({
      name: "remove-request",
      text: "DELETE FROM requests WHERE id = $1",
      values: id
    }, function (error, result) {
      if (error) {
        console.error(error);
        return callback({
          status: "Failure",
          failInfo: "Failed to delete requests"
        });
      }
      callback(null, {
        status: "Success",
        info: "Deleted request.",
      });
    });
  });
}

function getClassesNames(callback) {
  pool.query({
    name: "fetch-classes",
    text: "SELECT name FROM classes"
  }, function (error, result) {
    if (error) {
      console.error(error);
      return callback({
        status: "Failure",
        failInfo: "Failed to get classes names"
      });
    }
    var names = [];
    result.rows.forEach(function (row) {
      names.push(row.name);
    });
    callback(null, names);
  });
}

function getLocationsNames(callback) {
  pool.query({
    name: "fetch-locations",
    text: "SELECT name FROM locations"
  }, function (error, result) {
    if (error) {
      console.error(error);
      return callback({
        status: "Failure",
        failInfo: "Failed to get locations names"
      });
    }
    var names = [];
    result.rows.forEach(function (row) {
      names.push(row.name);
    });
    callback(null, names);
  });
}

module.exports = {
  insertRequest: insertRequest,
  updateRequest: updateRequest,
  getAllRequests: getAllRequests,
  deleteRequest: deleteRequest,
  serveRequest: serveRequest,
  getAllServing: getAllServing,
  deleteServe: deleteServe,
  getClassesNames: getClassesNames,
  getLocationsNames: getLocationsNames,
  validate_id: validate_id
};
