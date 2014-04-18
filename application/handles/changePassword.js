
module.exports = function (req, res) {
    var uid = req.session.user.id;
    if (uid === req.params.id || req.session.user.email === "brighthas@gmail.com") {
        req.userDomain.call("User.changePassword", req.params.id, [req.body.oldPassword, req.body.newPassword]).then(function () {
            res.send();
        }).fail(function (err) {
                res.send({error: "更改密码失败"});
            });
    } else {
        res.send({error: "更改密码失败"});
    }
}