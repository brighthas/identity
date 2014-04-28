var accessControl = require("../application/controller/accessControl");
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

app.get("/login", function (req, res) {
    req.session.user = {
        id: "u001",
        email: "brighthas@gmail.com"
    }
    res.send();
})

app.get("/login2", function (req, res) {
    req.session.user = {
        id: "u002",
        email: "leo@gmail.com"
    }
    res.send();
})

app.use('/users', accessControl);


function success(req, res) {
    res.send("success")
}

app.post("/users/:id/activate", success);
app.post("/users/:id/deactivate", success);
app.post("/users/:id/changeUsername", success);
app.post("/users/:id/changePassword", success);

app.use(function (err, req, res, next) {
    if (err) {
        res.send("500");
    }
})

describe("userCtrl", function () {

    it("#clearDB", function (done) {
        domain._my.repos.User.loopClear();
        db.remove({}, done);

    })

    it("#self", function (done) {
        request(app).get("/login2").end(function (err, res) {

            var cookie = res.headers['set-cookie'];
            request(app).post("/users/u002/changePassword")
                .set("cookie", cookie)
                .end(function (err, res) {
                    res.text.should.eql("success");
                    done();
                })
        })
    })

    it("#noself", function (done) {
        request(app).get("/login2").end(function (err, res) {

            var cookie = res.headers['set-cookie'];
            request(app).post("/users/u003/changePassword")
                .set("cookie", cookie)
                .end(function (err, res) {
                    res.text.should.eql("500");
                    done();
                })
        })
    })

    it("#isAdmin",function(done){
        request(app).get("/login").end(function (err, res) {

            var cookie = res.headers['set-cookie'];
            request(app).post("/users/u0055/activate")
                .set("cookie", cookie)
                .end(function (err, res) {
                    res.text.should.eql("success");
                    done();
                })
        })
    })


});