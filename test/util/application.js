var router = require("../../application/router");
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session  = require("express-session");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser("keyboard cat"));
app.use(session());

app.use(function(req,res,next){
    req.userDomain = require("./domain");
    req.query = require("./query");
    next();
})

app.use('/users', router);


module.exports = app;