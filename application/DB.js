var mongojs = require("mongojs");
module.exports = mongojs("userdb",["users"]).users;