var domain = require("../domain");
var should = require("should");
var crypto = require("crypto");


describe("User",function(){

    var user;
    var User = domain._my.Aggres.User;

    it("#new",function(){
        (function(){
            user = new User();
        }).should.throw();
        user = new User("uid001","email@qq.com", "leo", "123456")
    })

    it("#properties",function(){
        user.id.should.eql("uid001");
        user.email.should.eql("email@qq.com");
        user.username.should.eql("leo");
        user._password.should.eql(crypto.createHash("md5").update("123456").digest("hex"));
        user.activation.should.eql(true);
    })

    it("#deactivate",function(){
        user.deactivate();
        user.activation.should.eql(false);
        user.activate();
        user.activation.should.eql(true);
    })

    it("#changePassword",function(){
        user.changePassword("123456","abcdefg");
        user._password.should.eql(crypto.createHash("md5").update("abcdefg").digest("hex"));
    });

    it("#changeUsername",function(done){

        var user2 = new User("id002", "3@q.com", null, "jdkjkdjdfd");
        user.changeUsername("brighthas").fail(function(){
            user2.changeUsername("brighthas").then(function(rs){
                done();
            });
        });

    });

})