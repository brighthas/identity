var should = require("should");
var domain = require("../domain");
var validateUserUniqueService = domain._my.services.validateUserUniqueService;
var db = require("../application/db");

describe("validateUserUniqueService",function(){

    it("#clearDB", function (done) {
        db.remove({}, done);
    })

    it("#init",function(done){
        domain.repos.User.create({email:"leoisme@qq.com",username:"leoisme",password:"1111111111"},function(err){
            done();
        });
    })

    it("#execute",function(done){

        validateUserUniqueService("leoisme@qq.com", "", function(bool){
            bool.should.eql(false);
            validateUserUniqueService(null, "leoisme", function(bool){
                bool.should.eql(false);
                validateUserUniqueService(null, "leoisme2", function(bool){
                    bool.should.eql(true);
                    done()
                })
            })
        })
    })


})