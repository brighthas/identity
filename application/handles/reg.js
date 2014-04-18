module.exports = function (req, res) {
    req.userDomain.repos.User.create(req.body, function (err, user) {
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
}