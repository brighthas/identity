var _ = require("underscore");
var config = require("./application/config");

var result;

module.exports = function (conf) {

    if(result) return result;

    _.extend(config,conf);

    result = {
        controller: require("./application/controller"),
        domain: require("./domain"),
        db: require("./application/db"),
        query: require("./application/query")
    }

    return result;

}
