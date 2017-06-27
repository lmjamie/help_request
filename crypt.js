const bcrypt = require('bcrypt-nodejs');

bcrypt.hash("testhelp", null, null, function (err, hash) {
  console.log(hash);
});
//HelperMan
//testhelp
