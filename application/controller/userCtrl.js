var router = require("express").Router();
var query = require("../query");
var nodemailer = require("nodemailer");
var config = require("../config");
var validator = require("validator");
var domain = require("../../domain");

var crypto = require("crypto");

var transport = nodemailer.createTransport("SMTP", {
    service: config.email_provider,
    auth: {
        user: config.sys_email,
        pass: config.sys_email_pwd
    }
});

router.post("/login", function (req, res) {
    if (req.session.user) {
        res.send({error: "您已登录，请不要重复登录。"});
    } else {
        var username = req.body.username;
        var password = req.body.password;
        var err = {error: {username: "登录账号或密码有误，请重新登录。"}};

        function handle(user) {
            if (user) {
                if (user.password === crypto.createHash("md5").update(password).digest("hex")) {
                    req.session.user = user;
                    res.send();
                } else {
                    res.send(err);
                }
            } else {
                res.send(err);
            }
        }

        if (username && password) {
            if (validator.isEmail(username)) {
                query.getUserByEmail(username).then(handle);
            } else {
                query.getUserByUsername(username).then(handle);
            }
        } else {
            res.send(err);
        }
    }
});

router.post("/logout", function (req, res) {
    req.session.user = null;
    res.send();
})

router.post("/reg", function (req, res) {

    domain.repos.User.create(req.body, function (err, user) {
        if (err) {
            res.send({error: "注册信息有误，请重新输入注册信息" + err.stack});
        } else {
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            }
            res.send({userId:user.id});
        }
    })
});

router.post("/:id/activate",function (req, res) {
    domain.call("User.activate", req.params.id);
    res.send();
});

router.post("/:id/deactivate",function (req, res) {
    domain.call("User.deactivate", req.params.id);
    res.send();
});

router.post("/:id/changeUsername",function (req, res) {
    var uid = req.session.user.id;
    if (uid === req.params.id || req.session.user.email === "brighthas@gmail.com") {
        domain.call("User.changeUsername", req.params.id, [req.body.username]).then(function () {
            res.send();
        }).fail(function () {
                res.send({error: "更改名称失败"});
            });
    } else {
        res.send({error: "更改名称失败"});
    }
});

// {oldPassword , newPassword}
router.post("/:id/changePassword",function (req, res) {
    var uid = req.session.user.id;
    if (uid === req.params.id || req.session.user.email === "brighthas@gmail.com") {
        domain.call("User.changePassword", req.params.id, [req.body.oldPassword, req.body.newPassword]).then(function () {
            res.send();
        }).fail(function (err) {
                res.send({error: "更改密码失败"});
            });
    } else {
        res.send({error: "更改密码失败"});
    }
})

router.post("/findPassword",function (req, res) {
    query.getUserByEmail(req.body.email).then(function (user) {
        if (user) {
            transport.sendMail({
                from: "JSera.net官网账号－更改密码 <308212012@qq.com>",
                to: "hi <" + user.email + ">",
                subject: '更改密码',
                html: '<h3>亲爱的用户：</h3>' +
                    '您好！感谢您使用JSera.net服务，您正在进行邮箱更改密码：<a href=config.callback_url+"?email=' + user.email + "&code=" + user.password + '">点击更改密码</a>'

            }, function (err) {
                if (err) {
                    res.send({error: "内部错误，请联系管理员"});
                } else
                    res.send();
            });
        } else {
            res.send({error: "没有此用户"});
        }
    })
})

module.exports = router;

