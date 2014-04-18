module.exports = function (req, res) {
    req.userDomain.call("User.deactivate", req.params.id);
    res.send();
}