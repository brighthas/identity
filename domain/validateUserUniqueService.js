var Q = require("q");

module.exports = function (query) {

    return function(my) {

        userUnique.serviceName = "validateUserUniqueService";

        /**
         * 验证有没有 email 或 username 重复的用户
         * @param email
         * @param username
         * @param callback(bool)  bool 值 true表示唯一的 / false表示有重复并非唯一性
         */
        function userUnique(email, username, callback) {

            Q.all([
                    query.getUserByEmail(email),
                    query.getUserByUsername(username)
                ]).then(function (result) {
                    callback(result[0] || result[1] ? false : true);
                });
        }

        return [userUnique];

    }
}


