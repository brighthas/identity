var shortid = require("shortid");

module.exports = function(my){

    var userRepo = new my.Repository("User");

    userRepo._create = function (args, callback) {

        my.services.validateUserUniqueService(args.email, args.username, function (unique) {

            if (!unique) {
                callback(new Error("该用户已存在"));
            } else {
                try{
                    var uid = shortid.generate();
                    var user = new my.Aggres.User(uid, args.email, args.username, args.password);
                    callback(null,user);

                }catch(err){
                    callback(err);
                }
            }
        });

    }

    userRepo._aggre2data = function (aggre) {
        return {
            id:aggre.id,
            email:aggre.email,
            password:aggre._password,
            activation:aggre.activation,
            username:aggre.username,
            createTime:aggre.createTime
        }
    }

    userRepo._data2aggre = function (data) {

        var aggreObj = {
            _id:data.id,
            _password:data.password,
            _email:data.email,
            _activation:data.activation,
            _username : data.username,
            _createTime : data.createTime
        }

        my.Aggres.User.mix(aggreObj);

        return aggreObj;
    }

    return [userRepo];

}