const bcrypt = require('bcrypt-nodejs');

bcrypt.hash("test", null, null, function (err, hash) {
  console.log(hash);
});
// HelperMan
// test
