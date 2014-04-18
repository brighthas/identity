module.exports = function isLogin(req, res, next) {
    if (req.session.user)
        next();
    else
        res.send({error: {nologin: "没登录"}})
}