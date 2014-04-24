var db = require("./db");
var Q = require("q");

module.exports = {

    getUserByEmail: function (email) {
        var defer = Q.defer();
        db.findOne({email: email}, function (err, user) {
            defer.resolve(user);
        })
        return defer.promise;
    },

    getUserByUsername: function (username) {
        var defer = Q.defer();
        if(username){
            db.findOne({username: username}, function (err, user) {
                defer.resolve(user);
            })
        }else{
            defer.resolve();
        }
        return defer.promise;
    },

    getUserById: function (uid) {
        var defer = Q.defer();
        db.findOne({id: uid}, function (err, user) {
            defer.resolve(user);
        })
        return defer.promise;
    },

    allUser:function(){
        var defer = Q.defer();
        db.find().toArray(function(err,users){
            defer.resolve(users || []);
        })
        return defer.promise;
    }
}