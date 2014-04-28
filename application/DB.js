var mongojs = require("mongojs");
var config = require("./config");
module.exports = mongojs(config["mongo_url"],["users"]).users;