var r = require("random-word")("0123456789abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ");
var PW = require("png-word");
var pw = PW(PW.GREEN);

module.exports = function (query) {

    var util = {

        cookieLogin: function (req, res, next) {
            if (req.session.user) {
                next();
            } else {
                if (req.cookies.user) {
                    try {
                        var u = JSON.parse(req.cookies.user);
                        query("get a user by email", {email: u.email}).then(function (user) {
                            if (user && user.password === u.password) {
                                req.session.user = user;
                                next();
                            } else {
                                next();
                            }
                        });
                    } catch (e) {
                        next();
                    }
                } else {
                    next();
                }
            }
        },

        refreshValidatNum: function (req, res, next) {
            req.session.validat_num = r.random(4);
            next();
        },

        validat_num: function (req, res, next) {
            if (!(req.body.validat_num && req.session.validat_num && req.session.validat_num.toLocaleLowerCase() === req.body.validat_num.toLocaleLowerCase())) {
                req.result.error("validat_num", "验证码错误");
                util.refreshValidatNum(req,res,function(){});
                res.send(req.result.json());
            } else {
                next();
            }
        },

        validatNumPng: function (req, res, next) {

            if (!req.session.validat_num) {
                util.refreshValidatNum(req, res, function(){});
            }

            pw.createPNG(req.session.validat_num, function (pngnum) {
                req.result.data("validatNumPng", pngnum);
                next();
            });

        },

        isLogin: function (req, res, next) {
            if (!req.session.user) {
                req.result.error("email", "请先登录");
                return res.send(req.result);
            }
            next();

        }

    }

    return util;

}