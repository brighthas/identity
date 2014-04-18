var query = require("../application/query");
var db = require("../application/db");

describe("query",function(){

    // 初始化测试所需数据
    it("#init",function(done){
        // 删除全部数据
        db.remove({},{},function(){
            db.save({
                _id:"id001",
                id:"id001",
                email:"leo@qq.com",
                username:"leo",
                password:"123"
            },function(err){
                if(err)
                    throw err;
                done();
            })
        });


    })

    it("#getUserByEmail",function(done){
        query.getUserByEmail("leo@qq.com").then(function(rs){
            rs.email.should.eql("leo@qq.com");
            done();
        })
    })

    it("#getUserByUsername",function(){
        query.getUserByUsername("leo").then(function(rs){
            rs.email.should.eql("leo@qq.com");
            done();
        })
    })

    it("#allUser",function(done){
        query.allUser().then(function(rs){
            rs.length.should.eql(1);
            rs[0].email.should.eql("leo@qq.com");
            done();
        })
    })

    it("#getUserById",function(done){
        query.getUserById("id001").then(function(rs){
            rs.email.should.eql("leo@qq.com");
            done();
        })
    })
})