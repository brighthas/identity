var crypto = require("crypto");
var validator = require("validator");
var Q = require("q");

module.exports = function (my) {

    /**
     * 这个构造函数不会检查 email 和 username 在系统中是否唯一性。
     * 构造User是由jsdm系统的repository调用的。
     *
     * @param uid 用户id
     * @param email 用户email
     * @param username 用户名称，类似昵称
     * @param password 用户登录密码
     * @constructor
     */
    function User(uid, email, username, password) {
        if (validator.isEmail(email) && (!username || validator.isLength(username, 2, 12)) && validator.isLength(password, 6, 25)) {
            this._id = uid;
            this._email = email;
            this._username = username;
            this._password = crypto.createHash('md5').update(password).digest("hex");
            this._activation = true;
            this._createTime = Date.now();
        } else {
            throw new Error("创建用户失败");
        }
    }

    /**
     * @static
     * @param obj
     */
    User.mix = function (obj) {

        Object.defineProperties(obj, {

            id: {
                get: function () {
                    return this._id;
                }
            },

            createTime: {
                get: function () {
                    return this._createTime;
                }
            },

            email: {
                get: function () {
                    return this._email;
                }
            },
            username: {
                get: function () {
                    return this._username;
                }
            },
            activation: {
                get: function () {
                    return this._activation;
                }
            },

            activate: {

                value: function () {
                    if (!this.activation) {
                        this._activation = true;
                        my.publish("User.*.update", {id: this.id, activation: this.activation});
                    }
                }

            },

            deactivate: {
                value: function () {
                    if (this.activation) {
                        this._activation = false;
                        my.publish("User.*.update", {id: this.id, activation: this.activation});
                    }
                }
            },

            changePassword: {
                value: function (oldPassword, newPassword) {

                    if (oldPassword && validator.isLength(newPassword, 6, 25)) {
                        oldPassword = crypto.createHash('md5').update(oldPassword).digest("hex");
                        if (this._password === oldPassword) {
                            this._password = crypto.createHash('md5').update(newPassword).digest("hex");
                            my.publish("User.*.update", {id: this.id, password: this._password});
                        } else {
                            throw new Error("更改密码失败")
                        }
                    } else {
                        throw new Error("更改密码失败")
                    }
                }
            },

            // 如果已经存在username，将无权更改，返回promise。
            changeUsername: {
                value: function (username) {
                    var self = this;
                    var defer = Q.defer();

                    if(this.username){
                        defer.reject(new Error("更改用户名失败"));
                    }else{
                        if (validator.isLength(username, 2, 15)) {
                            my.services.validateUserUniqueService(null, username, function (unique) {
                                if (unique) {
                                    self._username = username;
                                    my.publish("User.*.update", {id: self.id, username: self.username});
                                    defer.resolve("success");
                                } else {
                                    defer.reject(new Error("更改用户名失败"));
                                }
                            })
                        } else {
                            defer.reject(new Error("更改用户名失败"));
                        }
                    }

                    return defer.promise;
                }
            }

        })
    }

    User.mix(User.prototype);

    User.className = "User";

    return User;

}