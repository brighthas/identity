module.exports = function (req, res) {
    var uid = req.session.user.id;
    if (uid === req.params.id || req.session.user.email === "brighthas@gmail.com") {
        req.userDomain.call("User.changeUsername", req.params.id, [req.body.username]).then(function () {
            res.send();
        }).fail(function () {
                res.send({error: "更改名称失败"});
            });
    } else {
        res.send({error: "更改名称失败"});
    }
}