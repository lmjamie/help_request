const database = require('./database');
const bcrypt = require('bcrypt-nodejs');

function login(un, pw, callback) {
  database.fetchHelper(un, function (error, result) {
    if (error)
      return callback(error);
    // setup error message in case it is needed.
    error = {
      status: "Failure",
      code: 401,
      failInfo: "Invalid username or password"
    }
    // check for bad username (no results)
    if (!result.rows.length)
      return callback(error);

    // Easier access
    hinfo = result.rows[0];

    // compare the hash to what was given
    bcrypt.compare(pw, hinfo.phash, function (compare_error, match) {
      if (compare_error) {
        console.error(compare_error);
        return callback({
          status: "Failure",
          code: 500,
          failInfo: "Something went wrong while comparing passwords"
        });
      }
      if (!match)
        return callback(error);
      callback(null, {
        status: "Success",
        helper_id: hinfo.id,
        name: hinfo.fname + " " + hinfo.lname
      });
    });
  });
}

module.exports = {
  login: login,
};
