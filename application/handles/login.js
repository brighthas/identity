var crypto = require("crypto");
var validator = require("validator");

module.exports = function (req, res) {
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
                req.query.getUserByEmail(username).then(handle)
            } else {
                req.query.getUserByUsername(username).then(handle)
            }
        } else {
            res.send(err);
        }
    }
}