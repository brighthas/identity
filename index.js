var _ = require("underscore");
var config = require("./application/config");
var domain = require("./domain");
var result;

module.exports = function (conf) {

    if (result) return result;

    _.extend(config, conf);

    result = {
        controller: require("./application/controller"),
        domain: domain,
        db: require("./application/db"),
        cookieLogin: function (req, res, next) {
            if (req.session.user) {
                next();
            } else {
                if (req.cookies.user) {
                    try {
                        var u = JSON.parse(req.cookies.user);
                        query.getUserByEmail().then(function (user) {
                            if (user && user.password === u.password) {
                                req.session.user = user;
                                next();
                            } else {
                                next();
                            }
                        });
                    } catch (e) {
                        next();
                    }
                } else {
                    next();
                }
            }
        },
        query: require("./application/query")
    }

    return result;

}
