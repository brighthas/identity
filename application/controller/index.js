var express = require('express');
var router = express.Router();

router.use("/",require("./accessControl"));
router.use("/",require("./userCtrl"));

module.exports = router;