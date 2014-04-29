var userCtrl = require("../application/controller/userCtrl");
var request = require('supertest');
var should = require("should");
var domain = require("../domain");
var crypto = require("crypto");

var db = require("../application/db");

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser("keyboard cat"));
app.use(session());

app.use('/users', userCtrl);

app.use(function (err, req, res, next) {
    if (err) {
        res.send("500");
    }
})

describe("userCtrl", function () {

    var leoId;


    it("#clearDB", function (done) {
        domain._my.repos.User.loopClear();
        db.remove({}, done);

    })

    it("#/users/reg", function (done) {
        request(app)
            .post("/users/reg")
            .send({username: "brighthas", email: "brighthas@gmail.com", password: "123456"})
            .end(function (err, res) {
                res.text.should.not.eql("500");
                request(app)
                    .post("/users/reg")
                    .send({username: "brighthas", email: "brighthas@gmail.com", password: "123456"})
                    .end(function (err, res) {

                        res.text.should.eql("500");

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

                        res.text.should.eql("500");

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


    it("#/users/:id/deactivate", function (done) {


        request(app)
            .post("/users/login")
            .send({username: "brighthas", password: "123456"})
            .end(function (err, res) {
                var cookie = res.headers['set-cookie'];

                request(app).post("/users/" + leoId + "/deactivate").set("cookie", cookie).end(function (err, res) {

                    should.not.exist(res.body.error);

                    domain.repos.User.get(leoId).then(function (u) {
                        u.activation.should.eql(false);
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
                    domain.repos.User.get(leoId).then(function (u) {
                        u.activation.should.eql(true);
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

                        domain.repos.User.get(leoId).then(function (u) {
                            u.username.should.eql("leoleoleo");
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

                        domain.repos.User.get(leoId).then(function (u) {
                            u._password.should.eql(crypto.createHash("md5").update("999666").digest("hex"));
                            done()
                        })

                    })
            });
    })

    it("#/users/:id/findPassword", function (done) {

        request(app).post("/users/findPassword")
            .send({email: "1405491181@qq.com"})
            .end(function (err, res) {
                done();
            })
    })


})