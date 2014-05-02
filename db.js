var mongojs = require("mongojs");
var config = require("./application/config");
module.exports = mongojs(config["mongo_url"],["users"]).users;