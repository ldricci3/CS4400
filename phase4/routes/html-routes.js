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

const create_appointment = function(app, connection) {
    app.get("/create_appointment", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.create_appointment(${query_args[0]},${query_args[1]},${query_args[2]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

const view_appointments = function(app, connection) {
    app.get("/view_appointments", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.view_appointments(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]},${query_args[4]},${query_args[5]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.view_appointments_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const view_testers = function(app, connection) {
    app.get("/view_testers", function(req, res) {
        connection.query(`CALL covidtest_fall2020.view_testers()`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.view_testers_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const create_testing_site = function(app, connection) {
    app.get("/create_testing_site", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.create_testing_site(${query_args[0]},${query_args[1]},${query_args[2]},${query_args[3]},${query_args[4]},${query_args[5]},${query_args[6]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

const pool_metadata = function(app, connection) {
    app.get("/pool_metadata", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.pool_metadata(${query_args[0]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.pool_metadata_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const tests_in_pool = function(app, connection) {
    app.get("/tests_in_pool", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.tests_in_pool(${query_args[0]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.tests_in_pool_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const tester_assigned_sites = function(app, connection) {
    app.get("/tester_assigned_sites", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.tester_assigned_sites(${query_args[0]})`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.tester_assigned_sites_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const assign_tester = function(app, connection) {
    app.get("/assign_tester", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.assign_tester(${query_args[0]},${query_args[1]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

const unassign_tester = function(app, connection) {
    app.get("/unassign_tester", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`CALL covidtest_fall2020.unassign_tester(${query_args[0]},${query_args[1]})`, function(err, data) {
            (err)?res.send(err):res.json({"Success":true});
        });
    });
};

const daily_results = function(app, connection) {
    app.get("/daily_results", function(req, res) {
        connection.query(`CALL covidtest_fall2020.daily_results()`, function(err, data) {
            (err)?res.send(err):connection.query(`SELECT * FROM covidtest_fall2020.daily_results_result;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
                }
            );
        });
    });
};

const get_user = function(app, connection) {
    app.get("/get_user", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`SELECT * FROM covidtest_fall2020.user LEFT JOIN covidtest_fall2020.administrator ON username = admin_username LEFT JOIN covidtest_fall2020.employee ON username = emp_username LEFT JOIN covidtest_fall2020.sitetester ON username = sitetester_username LEFT JOIN covidtest_fall2020.labtech ON username = labtech_username LEFT JOIN covidtest_fall2020.student ON username = student_username WHERE user.username = ${query_args[0]} AND user.user_password = MD5(${query_args[1]});`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
        });
    });
};

const get_testing_sites = function(app, connection) {
    app.get("/get_testing_sites", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`SELECT * FROM covidtest_fall2020.site;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
        });
    });
};

const get_locations = function(app, connection) {
    app.get("/get_locations", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`SELECT * FROM covidtest_fall2020.location;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
        });
    });
};

const get_max_test_id = function(app, connection) {
    app.get("/get_max_test_id", function(req, res) {
        query = decodeURI(req._parsedUrl.query);
        query_args = query.split(',');
        connection.query(`SELECT max(test_id) as test_id FROM covidtest_fall2020.test;`, function(err, data) {
                    (err)?res.send(err):res.json({result: data})
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
    create_appointment(app, connection);
    view_appointments(app, connection);
    view_testers(app, connection);
    create_testing_site(app, connection);
    pool_metadata(app, connection);
    tests_in_pool(app, connection);
    tester_assigned_sites(app, connection);
    assign_tester(app, connection);
    unassign_tester(app, connection);
    daily_results(app, connection);
    get_user(app, connection);
    get_testing_sites(app, connection);
    get_locations(app, connection);
    get_max_test_id(app, connection);
};
