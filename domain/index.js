var domain = require("jsdm")();
var db = require("../application/db");
var query = require("../application/query");

domain.register(
    "get",function (type, id, cb) {
        db.findOne({
            "id": id
        }, cb);
    },
    "AggreClass",
    require("./User"),
    "repository", require("./userRepo"),
    "service", require("./validateUserUniqueService")(query)
).openMethod(
        "User.changePassword",
        "User.activate",
        "User.changeUsername",
        "User.deactivate"
    ).seal();

domain.on("User.*.create", function (data) {
    data._id = data.id;
    db.save(data);
})

domain.on("User.*.update", function (data) {
    var id = data.id;
    db.update({id: id}, { $set: data});
})

module.exports = domain;
