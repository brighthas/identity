var domain = require("./util/domain");
var should = require("should");
var crypto = require("crypto");

describe("userRepo", function () {

    var userRepository = domain._my.repos.User;
    var user,data;

    it("#_create", function (done) {

        userRepository._create({
            username:"leo",
            email:"leo@qq.com",
            password:"11111111"
        },function(err,rs){
            user = rs;
            rs.username.should.eql("leo");
            rs.email.should.eql("leo@qq.com");
            var pwd = crypto.createHash("md5").update("11111111").digest("hex");
            rs._password.should.eql(pwd);
            rs.activation.should.eql(true);
            done();
        })
    })

    it("#_aggre2data", function () {
        data = userRepository._aggre2data(user);
        data.username.should.eql("leo");
        data.email.should.eql("leo@qq.com");
        data.password.should.eql(crypto.createHash("md5").update("11111111").digest("hex"))
        data.activation.should.eql(true);
    })

    it("#_data2aggre", function () {

        var u = userRepository._data2aggre(data);
        u.should.eql(user);
    })



})