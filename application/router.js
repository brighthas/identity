var router = require("express").Router();

router.post("/login", require("./handles/login"));

router.post("/logout", function (req, res) {
    req.session.user = null;
    res.send();
})

router.post("/reg", require("./handles/reg"));

// 列出全部用户或取得一个用户的信息
router.get("/:id?",
    require("./handles/isLogin"),
    require("./handles/isAdmin"),
    require("./handles/getUser"))

router.post("/:id/activate",
    require("./handles/isLogin"),
    require("./handles/isAdmin"),
    require("./handles/activate"));

router.post("/:id/deactivate",
    require("./handles/isLogin"),
    require("./handles/isAdmin"),
    require("./handles/deactivate"));

router.post("/:id/changeUsername",
    require("./handles/isLogin"),
    require("./handles/changeName"));

// {oldPassword , newPassword}
router.post("/:id/changePassword",
    require("./handles/isLogin"),
    require("./handles/changePassword"))

router.post("/:id/findPassword",
    require("./handles/findPassword"))

module.exports = router;