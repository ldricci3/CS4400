const mysql = require('mysql');

const test = function(app, connection) {
    app.get("/test", function(req, res) {
        connection.query("SELECT * FROM covidtest_fall2020.user", function(err, data) {
            (err)?res.send(err):res.json({users: data});
        });
    });
};

const register_student = function(app, connection) {
    app.get("/register_student", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.register_student(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]},${query_args[4]},${query_args[5]},${query_args[6]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

const register_employee = function(app, connection) {
    app.get("/register_employee", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.register_employee(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]},${query_args[4]},${query_args[5]},${query_args[6]},${query_args[7]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

const student_view_results = function(app, connection) {
    app.get("/student_view_results", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.student_view_results(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.student_view_results_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const explore_results = function(app, connection) {
    app.get("/explore_results", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.explore_results(${query_args[0]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.explore_results_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const aggregate_results = function(app, connection) {
    app.get("/aggregate_results", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.aggregate_results(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]},${query_args[4]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.aggregate_results_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const test_sign_up_filter = function(app, connection) {
    app.get("/test_sign_up_filter", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.test_sign_up_filter(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]},${query_args[4]},${query_args[5]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.test_sign_up_filter_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const test_sign_up = function(app, connection) {
    app.get("/test_sign_up", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.test_sign_up(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]},${query_args[4]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

const tests_processed = function(app, connection) {
    app.get("/tests_processed", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.tests_processed(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.tests_processed_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const view_pools = function(app, connection) {
    app.get("/view_pools", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.view_pools(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.view_pools_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const create_pool = function(app, connection) {
    app.get("/create_pool", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.create_pool(${query_args[0]},${query_args[1]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

const assign_test_to_pool = function(app, connection) {
    app.get("/assign_test_to_pool", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.assign_test_to_pool(${query_args[0]},${query_args[1]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};
const process_pool = function(app, connection) {
    app.get("/process_pool", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.process_pool(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

const process_test = function(app, connection) {
    app.get("/process_test", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.process_test(${query_args[0]},${query_args[1]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

module.exports = function(app, connection) {
    test(app, connection);
    register_student(app, connection);
    register_employee(app, connection);
    student_view_results(app, connection);
    explore_results(app, connection);
    aggregate_results(app, connection);
    test_sign_up_filter(app, connection);
    test_sign_up(app, connection);
    tests_processed(app, connection);
    view_pools(app, connection);
    create_pool(app, connection);
    assign_test_to_pool(app, connection);
    process_pool(app, connection);
    process_test(app, connection);
};
