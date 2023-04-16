var bcrypt = require('bcryptjs');

let password = "1234"

var salt = bcrypt.genSaltSync(10);
console.log(salt)
var hashedPassword = bcrypt.hashSync(password, salt);



bcrypt.compare("1234", "$2a$10$9431BmuBHrcGUgBklM0B0OR6e8K/6zssPjUBAF0T3NV4xrAOzE/tm", function(err, res) {
    console.log(res)
});