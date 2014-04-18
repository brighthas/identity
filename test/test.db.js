var db = require("../application/db");

describe("db", function () {
    it("#connection", function (done) {
        db.find(function (err) {
            if (err)
                throw err;
            done()
        })
    })
})