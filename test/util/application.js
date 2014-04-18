var router = require("express").Router();

router.use(function(req,res,next){
    req.userDomain = require("./domain");
    req.query = require("./query");
    next();
})

router.post("/login", require("../../application/handles/login"));

router.post("/logout", function (req, res) {
    req.session.user = null;
    res.send();
})

router.post("/reg", require("../../application/handles/reg"));

// 列出全部用户或取得一个用户的信息
router.get("/:id?",
    require("../../application/handles/isLogin"),
    require("../../application/handles/isAdmin"),
    require("../../application/handles/getUser"))

router.post("/:id/activate",
    require("../../application/handles/isLogin"),
    require("../../application/handles/isAdmin"),
    require("../../application/handles/activate"));

router.post("/:id/deactivate",
    require("../../application/handles/isLogin"),
    require("../../application/handles/isAdmin"),
    require("../../application/handles/deactivate"));

router.post("/:id/changeUsername",
    require("../../application/handles/isLogin"),
    require("../../application/handles/changeName"));

// {oldPassword , newPassword}
router.post("/:id/changePassword",
    require("../../application/handles/isLogin"),
    require("../../application/handles/changePassword"))

router.post("/:id/findPassword",
    require("../../application/handles/findPassword"))

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session  = require("express-session");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser("keyboard cat"));
app.use(session());

app.use('/users', router);

module.exports = app;