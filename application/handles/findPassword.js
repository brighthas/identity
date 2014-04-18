var nodemailer = require("nodemailer");
var config = require("../config");

var transport = nodemailer.createTransport("SMTP", {
    service: config.email_provider,
    auth: {
        user: config.sys_email,
        pass: config.sys_email_pwd
    }
});

module.exports = function (req, res) {
    req.query.getUserByEmail(req.body.email).then(function (user) {
        if (user) {
            transport.sendMail({
                from: "JSera.net官网账号－更改密码 <308212012@qq.com>",
                to: "hi <" + user.email + ">",
                subject: '更改密码',
                html: '<h3>亲爱的用户：</h3>' +
                    '您好！感谢您使用JSera.net服务，您正在进行邮箱更改密码：<a href=config.callback_url+"?email=' + user.email + "&code=" + user.password + '">点击更改密码</a>'

            }, function (err) {
                if (err){
                    res.send({error:"内部错误，请联系管理员"});
                }else
                    res.send();
            });
        } else {
            res.send({error:"没有此用户"});
        }
    })
}