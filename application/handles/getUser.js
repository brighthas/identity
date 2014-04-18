
module.exports = function (req, res) {
    if (req.params.id) {
        req.query.getUserById(req.params.id).then(function (user) {
            res.send(user);
        })
    } else {
        req.query.allUser().then(function (users) {
            res.send(users);
        })
    }
}