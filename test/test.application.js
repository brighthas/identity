var app = require("./util/application");
var request = require('supertest');
var should = require("should");
var crypto = require("crypto");

describe("application", function () {

    var leoId;

    it("#/users/reg", function (done) {
        request(app)
            .post("/users/reg")
            .send({username: "brighthas", email: "brighthas@gmail.com", password: "123456"})
            .end(function (err, res) {

                should.not.exist(res.body.error);
                request(app)
                    .post("/users/reg")
                    .send({username: "brighthas", email: "brighthas@gmail.com", password: "123456"})
                    .end(function (err, res) {
                        should.exist(res.body.error);

                        request(app)
                            .post("/users/reg")
                            .send({email: "1405491181@qq.com", password: "123456"})
                            .end(function (err, res) {
                                leoId = res.body.userId;
                                done();
                            })
                    })
            })
    })

    it("#/users/login", function (done) {
        request(app)
            .post("/users/login")
            .send({username: "brighthas", password: "123456"})
            .end(function (err, res) {
                should.not.exist(res.body.error);
                request(app)
                    .post("/users/login")
                    .send({username: "brighthas2", password: "123456"})
                    .end(function (err, res) {
                        should.exist(res.body.error);
                        request(app)
                            .post("/users/login")
                            .send({username: "brighthas@gmail.com", password: "123456"})
                            .end(function (err, res) {
                                should.not.exist(res.body.error);
                                done();
                            })
                    })
            })
    })


    var userId;

    it("#/users/:id?", function (done) {

        request(app)
            .post("/users/login")
            .send({username: "brighthas", password: "123456"})
            .end(function (err, res) {

                should.not.exist(res.body.error);
                var cookie = res.headers['set-cookie'];

                request(app).get("/users").set('cookie', cookie)
                    .end(function (err, result) {
                        result.body.length.should.eql(2);
                        userId = result.body[0].id;
                        request(app).get("/users/" + userId).set('cookie', cookie)
                            .end(function (err, result) {
                                result.body.id.should.eql(userId);
                                done();
                            })
                    })

            })

    })

    it("#/users/:id/deactivate", function (done) {


        request(app)
            .post("/users/login")
            .send({username: "brighthas", password: "123456"})
            .end(function (err, res) {
                var cookie = res.headers['set-cookie'];

                request(app).post("/users/" + leoId + "/deactivate").set("cookie", cookie).end(function (err, res) {

                    should.not.exist(res.body.error);
                    request(app).get("/users/" + leoId).set("cookie", cookie).end(function (err, res) {

                        res.body.activation.should.eql(false);
                        done()
                    })

                })

            });
    })


    it("#/users/:id/activate", function (done) {
        request(app)
            .post("/users/login")
            .send({username: "brighthas", password: "123456"})
            .end(function (err, res) {
                var cookie = res.headers['set-cookie'];

                request(app).post("/users/" + leoId + "/activate").set("cookie", cookie).end(function (err, res) {

                    should.not.exist(res.body.error);
                    request(app).get("/users/" + leoId).set("cookie", cookie).end(function (err, res) {

                        res.body.activation.should.eql(true);
                        done()
                    })

                })

            });
    })


    it("#/users/:id/changeUsername", function (done) {

        request(app)
            .post("/users/login")
            .send({username: "brighthas", password: "123456"})
            .end(function (err, res) {

                var cookie = res.headers['set-cookie'];
                request(app).post("/users/" + leoId + "/changeUsername")
                    .send({username: "leoleoleo"})
                    .set("cookie", cookie)
                    .end(function (err, res) {
                        should.not.exist(res.body.error);

                        request(app).get("/users/" + leoId).set("cookie", cookie).end(function (err, res) {
                            res.body.username.should.eql("leoleoleo");
                            done()
                        })

                    })
            });
    })

    it("#/users/:id/changePassword", function (done) {

        request(app)
            .post("/users/login")
            .send({username: "brighthas", password: "123456"})
            .end(function (err, res) {

                var cookie = res.headers['set-cookie'];
                request(app).post("/users/" + leoId + "/changePassword")
                    .send({oldPassword: "123456", newPassword: "999666"})
                    .set("cookie", cookie)
                    .end(function (err, res) {

                        should.not.exist(res.body.error);

                        request(app).get("/users/" + leoId).set("cookie", cookie).end(function (err, res) {
                            res.body.password.should.eql(crypto.createHash("md5").update("999666").digest("hex"));
                            done()
                        })

                    })
            });
    })

    it("#/users/:id/changePassword", function (done) {

        request(app)
            .post("/users/login")
            .send({username: "brighthas", password: "123456"})
            .end(function (err, res) {

                var cookie = res.headers['set-cookie'];
                request(app).post("/users/" + userId + "/findPassword")
                    .send({email:"1405491181@qq.com"})
                    .set("cookie", cookie)
                    .end(function (err, res) {

                        //console.log(res.body);
                        done();

                    })
            });
    })


})