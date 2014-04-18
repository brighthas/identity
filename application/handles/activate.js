
module.exports = function (req, res) {
    req.userDomain.call("User.activate", req.params.id);
    res.send();
}