var express = require('express');
var router = express.Router();

function isAdminOrSelf(req, res, next) {
    if ((req.session.user && req.session.user.email === "brighthas@gmail.com") || req.params.id === req.session.user.id) {
        next();
    } else {
        next(500);
    }
}

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.email === "brighthas@gmail.com") {
        next();
    } else {
        next(500);
    }
}

router.post("/:id/activate", isAdmin);
router.post("/:id/deactivate", isAdmin);

router.post("/:id/changeUsername", isAdminOrSelf);
router.post("/:id/changePassword", isAdminOrSelf);

module.exports = router;