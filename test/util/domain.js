var domain = require("jsdm")();
var db = require("./db");
var query = require("./query");

domain.register(
    "get",function (type, id, cb) {
        db.findOne({
            "id": id
        },cb);
    },
    "AggreClass",
    require("../../domain/User"),
    "repository", require("../../domain/userRepo"),
    "service", require("../../domain/validateUserUniqueService")(query)
).openMethod(
        "User.changePassword",
        "User.activate",
        "User.changeUsername",
        "User.deactivate"
    ).seal();

domain.on("User.*.create",function(data){
    data._id = data.id;
    db.insert(data);
})

domain.on("User.*.update",function(data){
    var id = data.id;
    delete data.id;
    db.update({id:id},{ $set:data},{});
})

module.exports = domain;
