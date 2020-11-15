const mysql = require('mysql');

module.exports = function(app, connection) {
    app.get("/test", function(req, res) {
        connection.query("SELECT * FROM covidtest_fall2020.user", function(err, data) {
            (err)?res.send(err):res.json({users: data});
        });
    });
};
