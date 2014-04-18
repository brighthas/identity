module.exports = function isAdmin(req, res, next) {
    if (req.session.user.email === "brighthas@gmail.com")
        next();
    else
        res.send({error: {noadmin: "不是管理员"}})
}