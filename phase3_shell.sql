/*
CS4400: Introduction to Database Systems
Fall 2020
Phase III Template

Team 41
Andrew Johnston (ajohnston41)
Colin Keenan (ckeenan9)
Leo Ricci (lricci7)
Lewey Wilson (Lwilson67)

Directions:
Please follow all instructions from the Phase III assignment PDF.
This file must run without error for credit.
*/


-- ID: 2a
-- Author: lvossler3
-- Name: register_student
DROP PROCEDURE IF EXISTS register_student;
DELIMITER //
CREATE PROCEDURE register_student(
		IN i_username VARCHAR(40),
        IN i_email VARCHAR(40),
        IN i_fname VARCHAR(40),
        IN i_lname VARCHAR(40),
        IN i_location VARCHAR(40),
        IN i_housing_type VARCHAR(20),
        IN i_password VARCHAR(40)
)
BEGIN

-- Type solution below
INSERT INTO user (username, user_password, email, fname, lname) VALUES (i_username, MD5(i_password), i_email, i_fname, i_lname);
INSERT INTO student (student_username, housing_type, location) VALUES (i_username, i_housing_type, i_location);
-- End of solution
END //
DELIMITER ;

-- ID: 2b
-- Author: lvossler3
-- Name: register_employee
DROP PROCEDURE IF EXISTS register_employee;
DELIMITER //
CREATE PROCEDURE register_employee(
		IN i_username VARCHAR(40),
        IN i_email VARCHAR(40),
        IN i_fname VARCHAR(40),
        IN i_lname VARCHAR(40),
        IN i_phone VARCHAR(10),
        IN i_labtech BOOLEAN,
        IN i_sitetester BOOLEAN,
        IN i_password VARCHAR(40)
)
BEGIN
-- Type solution below
INSERT INTO user (username, user_password, email, fname, lname) VALUES (i_username, MD5(i_password), i_email, i_fname, i_lname);
INSERT INTO employee (emp_username, phone_num) VALUES (i_username, i_phone);

IF i_labtech = true THEN
	INSERT INTO labtech (labtech_username) VALUES (i_username);
END IF;

IF i_sitetester = true THEN
	INSERT INTO sitetester (sitetester_username) VALUES (i_username);
END IF;

-- End of solution
END //
DELIMITER ;

-- ID: 4a
-- Author: Aviva Smith
-- Name: student_view_results
DROP PROCEDURE IF EXISTS `student_view_results`;
DELIMITER //
CREATE PROCEDURE `student_view_results`(
    IN i_student_username VARCHAR(50),
	IN i_test_status VARCHAR(50),
	IN i_start_date DATE,
    IN i_end_date DATE
)
BEGIN
	DROP TABLE IF EXISTS student_view_results_result;
    CREATE TABLE student_view_results_result(
        test_id VARCHAR(7),
        timeslot_date date,
        date_processed date,
        pool_status VARCHAR(40),
        test_status VARCHAR(40)
    );
    INSERT INTO student_view_results_result

    -- Type solution below

		SELECT t.test_id, t.appt_date, p.process_date, p.pool_status , t.test_status
        FROM Appointment a
            LEFT JOIN Test t
                ON t.appt_date = a.appt_date
                AND t.appt_time = a.appt_time
                AND t.appt_site = a.site_name
            LEFT JOIN Pool p
                ON t.pool_id = p.pool_id
        WHERE i_student_username = a.username
            AND (i_test_status = t.test_status OR i_test_status IS NULL)
            AND (i_start_date <= t.appt_date OR i_start_date IS NULL)
            AND (i_end_date >= t.appt_date OR i_end_date IS NULL);

    -- End of solution
END //
DELIMITER ;

-- ID: 5a
-- Author: asmith457
-- Name: explore_results
DROP PROCEDURE IF EXISTS explore_results;
DELIMITER $$
CREATE PROCEDURE explore_results (
    IN i_test_id VARCHAR(7))
BEGIN
    DROP TABLE IF EXISTS explore_results_result;
    CREATE TABLE explore_results_result(
        test_id VARCHAR(7),
        test_date date,
        timeslot time,
        testing_location VARCHAR(40),
        date_processed date,
        pooled_result VARCHAR(40),
        individual_result VARCHAR(40),
        processed_by VARCHAR(80)
    );
    INSERT INTO explore_results_result

    -- Type solution below

	SELECT test_id, appt_date, appt_time as 'timeslot', appt_site as 'testing_location', process_date as 'date_processed', pool_status as 'pooled_result', test_status as 'individual_result', concat(fname, ' ', lname) as 'processed_by'
	from test, pool, user
	where test_id = i_test_id and test.pool_id = pool.pool_id and processed_by = username;

    -- End of solution
END$$
DELIMITER ;

-- ID: 6a
-- Author: asmith457
-- Name: aggregate_results
DROP PROCEDURE IF EXISTS aggregate_results;
DELIMITER $$
CREATE PROCEDURE aggregate_results(
    IN i_location VARCHAR(50),
    IN i_housing VARCHAR(50),
    IN i_testing_site VARCHAR(50),
    IN i_start_date DATE,
    IN i_end_date DATE)
BEGIN
    DROP TABLE IF EXISTS aggregate_results_result;
    CREATE TABLE aggregate_results_result(
        test_status VARCHAR(40),
        num_of_test INT,
        percentage DECIMAL(6,2)
    );

    INSERT INTO aggregate_results_result

    -- Type solution below

    	SELECT test_status, count(distinct test_id) as num_of_tests, round((count(distinct test_id) / (
		SELECT count(distinct test_id) 
		FROM test, site, student, appointment
		WHERE
        	(case 
		when i_location is null then True
		else test.appt_site = appointment.site_name and test.appt_time = appointment.appt_time and test.appt_date = appointment.appt_date and appointment.username = student.student_username and student.location = i_location
	end)
	and
	(case 
		when i_housing is null then True
		else test.appt_site = appointment.site_name and test.appt_time = appointment.appt_time and test.appt_date = appointment.appt_date and appointment.username = student.student_username and student.housing_type = i_housing
	end)
	and
	(case 
		when i_testing_site is null then True
		else test.appt_site = i_testing_site
	end)
	and
	(case 
		when i_start_date is null then True
		else test.appt_date >= i_start_date
	end)
	and
	(case 
		when i_end_date is null then True
		else test.appt_date <= i_end_date
	end)
		)) * 100, 2) as percentage
	FROM test, site, student, appointment
	WHERE 	(case 
		when i_location is null then True
		else test.appt_site = appointment.site_name and test.appt_time = appointment.appt_time and test.appt_date = appointment.appt_date and appointment.username = student.student_username and student.location = i_location
	end)
	and
	(case 
		when i_housing is null then True
		else test.appt_site = appointment.site_name and test.appt_time = appointment.appt_time and test.appt_date = appointment.appt_date and appointment.username = student.student_username and student.housing_type = i_housing
	end)
	and
	(case 
		when i_testing_site is null then True
		else test.appt_site = i_testing_site
	end)
	and
	(case 
		when i_start_date is null then True
		else test.appt_date >= i_start_date
	end)
	and
	(case 
		when i_end_date is null then True
		else test.appt_date <= i_end_date
	end)
	GROUP BY test_status;


    -- End of solution
END$$
DELIMITER ;


-- ID: 7a
-- Author: lvossler3
-- Name: test_sign_up_filter
DROP PROCEDURE IF EXISTS test_sign_up_filter;
DELIMITER //
CREATE PROCEDURE test_sign_up_filter(
    IN i_username VARCHAR(40),
    IN i_testing_site VARCHAR(40),
    IN i_start_date date,
    IN i_end_date date,
    IN i_start_time time,
    IN i_end_time time)
BEGIN
    DROP TABLE IF EXISTS test_sign_up_filter_result;
    CREATE TABLE test_sign_up_filter_result(
        appt_date date,
        appt_time time,
        street VARCHAR (40),
        city VARCHAR(40),
        state VARCHAR(2),
        zip VARCHAR(5),
        site_name VARCHAR(40));
    INSERT INTO test_sign_up_filter_result

    -- Type solution below
    SELECT appt_date, appt_time, street, city, state, zip, appointment.site_name
    FROM appointment JOIN site ON  appointment.site_name = site.site_name
    WHERE appointment.username IS NULL
		AND site.location = (SELECT location FROM student JOIN user ON username = student_username WHERE student_username = i_username) 
		AND ((site.site_name = i_testing_site) OR i_testing_site IS NULL)
        AND ((appointment.appt_date >= i_start_date) OR i_start_date IS NULL)
        AND ((appointment.appt_date <= i_end_date) OR i_end_date IS NULL)
        AND ((appointment.appt_time >= i_start_time) OR i_start_time IS NULL)
        AND ((appointment.appt_time <= i_end_time) OR i_end_time IS NULL);
    -- End of solution

    END //
    DELIMITER ;

-- ID: 7b
-- Author: lvossler3
-- Name: test_sign_up
DROP PROCEDURE IF EXISTS test_sign_up;
DELIMITER //
CREATE PROCEDURE test_sign_up(
		IN i_username VARCHAR(40),
        IN i_site_name VARCHAR(40),
        IN i_appt_date date,
        IN i_appt_time time,
        IN i_test_id VARCHAR(7)
)
BEGIN
-- Type solution below

    SELECT username
    INTO @curr_appointment_username
    FROM appointment JOIN site ON appointment.site_name = site.site_name
    WHERE site.location = (SELECT location FROM student JOIN user ON username = student_username WHERE student_username = i_username)
		AND appointment.site_name = i_site_name AND appt_date = i_appt_date AND appt_time = i_appt_time;

    SELECT username
    INTO @curr_appointment_pending_username
    FROM appointment JOIN test ON appt_site = site_name AND test.appt_date = appointment.appt_date AND test.appt_time = appointment.appt_time
    WHERE test_status = "pending" AND username = i_username;
    
    SELECT test_id
    INTO @curr_test_id
    FROM test JOIN appointment ON appt_site = site_name AND test.appt_date = appointment.appt_date AND test.appt_time = appointment.appt_time
    WHERE test_id = i_test_id;
        
    IF
        (@curr_appointment_username IS NULL) AND (@curr_appointment_pending_username IS NULL) and (@curr_test_id IS NULL)
    THEN
        UPDATE appointment
        SET  username = i_username
        WHERE site_name = i_site_name AND appt_date = i_appt_date AND appt_time = i_appt_time;
        INSERT INTO test(test_id, test_status, pool_id, appt_site, appt_date, appt_time)
        VALUES(i_test_id, "pending", NULL, i_site_name, i_appt_date, i_appt_time);
    END IF;

-- End of solution
END //
DELIMITER ;

-- Number: 8a
-- Author: lvossler3
-- Name: tests_processed
DROP PROCEDURE IF EXISTS tests_processed;
DELIMITER //
CREATE PROCEDURE tests_processed(
    IN i_start_date date,
    IN i_end_date date,
    IN i_test_status VARCHAR(10),
    IN i_lab_tech_username VARCHAR(40))
BEGIN
    DROP TABLE IF EXISTS tests_processed_result;
    CREATE TABLE tests_processed_result(
        test_id VARCHAR(7),
        pool_id VARCHAR(10),
        test_date date,
        process_date date,
        test_status VARCHAR(10) );
    INSERT INTO tests_processed_result
    -- Type solution below

        SELECT test_id, test.pool_id, appt_date AS test_date, process_date, test_status
        FROM test JOIN pool ON test.pool_id = pool.pool_id
        WHERE ((appt_date >= i_start_date) OR i_start_date IS NULL)
			AND ((appt_date <= i_end_date) OR i_end_date IS NULL)
            AND ((test_status = i_test_status) OR i_test_status IS NULL)
            AND (processed_by = i_lab_tech_username);

    -- End of solution
    END //
    DELIMITER ;

-- ID: 9a
-- Author: ahatcher8@
-- Name: view_pools
DROP PROCEDURE IF EXISTS view_pools;
DELIMITER //
CREATE PROCEDURE view_pools(
    IN i_begin_process_date DATE,
    IN i_end_process_date DATE,
    IN i_pool_status VARCHAR(20),
    IN i_processed_by VARCHAR(40)
)
BEGIN
    DROP TABLE IF EXISTS view_pools_result;
    CREATE TABLE view_pools_result(
        pool_id VARCHAR(10),
        test_ids VARCHAR(100),
        date_processed DATE,
        processed_by VARCHAR(40),
        pool_status VARCHAR(20));

    INSERT INTO view_pools_result
-- Type solution below

        SELECT pool.pool_id, GROUP_CONCAT(test.test_id), process_date AS date_processed, processed_by, pool_status
        FROM pool JOIN test ON test.pool_id = pool.pool_id
        WHERE
			(CASE 
				WHEN i_processed_by IS NULL THEN TRUE 
				ELSE processed_by = i_processed_by AND pool_status != "pending"
			END) AND (CASE
				WHEN i_end_process_date IS NULL THEN TRUE
				ELSE process_date <= i_end_process_date AND pool_status != "pending"
			END) AND (CASE
				WHEN i_begin_process_date IS NULL THEN TRUE
				ELSE process_date >= i_begin_process_date OR process_date IS NULL
			END) AND (CASE
				WHEN ((i_processed_by IS NULL AND i_end_process_date IS NULL) AND (i_pool_status = "positive" OR i_pool_status = "negative" OR i_pool_status = "pending")) THEN pool_status = i_pool_status
				ELSE TRUE
			END) AND (CASE 
				WHEN (i_pool_status = "positive" OR i_pool_status = "negative" OR i_pool_status = "pending") THEN pool_status = i_pool_status
				ELSE TRUE
			END) AND (CASE
				WHEN (i_pool_status IS NOT NULL AND (i_pool_status != "positive" AND i_pool_status != "negative" AND i_pool_status != "pending")) THEN FALSE
				ELSE TRUE
			END)
		GROUP BY pool.pool_id;

-- End of solution
END //
DELIMITER ;

-- ID: 10a
-- Author: ahatcher8@
-- Name: create_pool
DROP PROCEDURE IF EXISTS create_pool;
DELIMITER //
CREATE PROCEDURE create_pool(
	IN i_pool_id VARCHAR(10),
    IN i_test_id VARCHAR(7)
)
BEGIN
-- Type solution below
IF (SELECT pool_id FROM test WHERE test_id = i_test_id) IS NULL 
AND (SELECT pool_id FROM pool WHERE pool_id = i_pool_id) IS NULL
AND (SELECT test_id FROM test where test_id = i_test_id) IS NOT NULL THEN
	INSERT INTO pool (pool_id, pool_status, process_date, processed_by) VALUES (i_pool_id, 'pending', NULL, NULL);
	UPDATE test SET pool_id = i_pool_id where test_id = i_test_id;
END IF;
-- End of solution
END //
DELIMITER ;

-- ID: 10b
-- Author: ahatcher8@
-- Name: assign_test_to_pool
DROP PROCEDURE IF EXISTS assign_test_to_pool;
DELIMITER //
CREATE PROCEDURE assign_test_to_pool(
    IN i_pool_id VARCHAR(10),
    IN i_test_id VARCHAR(7)
)
BEGIN
-- Type solution below
DECLARE TESTVAL INT;
SELECT COUNT(pool_id) INTO TESTVAL
FROM test 
WHERE pool_id = i_pool_id;

IF TESTVAL >= 7 THEN
	SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'There can be no more than 7 tests in a pool';
END IF;

IF (SELECT pool_id FROM test WHERE test_id = i_test_id) IS NULL THEN
	UPDATE test SET pool_id = i_pool_id where test_id = i_test_id;
END IF;

-- End of solution
END //
DELIMITER ;

-- ID: 11a
-- Author: ahatcher8@
-- Name: process_pool
DROP PROCEDURE IF EXISTS process_pool;
DELIMITER //
CREATE PROCEDURE process_pool(
    IN i_pool_id VARCHAR(10),
    IN i_pool_status VARCHAR(20),
    IN i_process_date DATE,
    IN i_processed_by VARCHAR(40)
)
BEGIN
-- Type solution below

    SELECT pool_status
    INTO @curr_status
    FROM POOL
    WHERE pool_id = i_pool_id;

    IF
        ((@curr_status = 'pending') AND (i_pool_status = 'positive' OR i_pool_status = 'negative'))
    THEN
        UPDATE POOL
        SET pool_status = i_pool_status, process_date = i_process_date, processed_by = i_processed_by
        WHERE pool_id = i_pool_id;
    END IF;


-- End of solution
END //
DELIMITER ;

-- ID: 11b
-- Author: ahatcher8@
-- Name: process_test
DROP PROCEDURE IF EXISTS process_test;
DELIMITER //
CREATE PROCEDURE process_test(
    IN i_test_id VARCHAR(7),
    IN i_test_status VARCHAR(20)
)
BEGIN
-- Type solution below
	if 'pending' in (select test_status from test where test_id = i_test_id) and i_test_status = 'positive' or i_test_status = 'negative'then
		if exists(select * from test natural join pool where pool_status = 'positive' and pool_id in (select pool_id from test where test_id = i_test_id)) then 
		update test
		set test_status = i_test_status
		where test_id = i_test_id;
		elseif i_test_status = 'negative' then
		update test
		set test_status = i_test_status
		where test_id = i_test_id;
		end if;
    end if;
-- End of solution
END //
DELIMITER ;

-- ID: 12a
-- Author: dvaidyanathan6
-- Name: create_appointment

DROP PROCEDURE IF EXISTS create_appointment;
DELIMITER //
CREATE PROCEDURE create_appointment(
	IN i_site_name VARCHAR(40),
    IN i_date DATE,
    IN i_time TIME
)
BEGIN
-- Type solution below
	INSERT INTO APPOINTMENT(username, site_name, appt_date, appt_time)
    SELECT null, i_site_name, i_date, i_time
    FROM DUAL
    WHERE (SELECT COUNT(*) FROM APPOINTMENT WHERE site_name = i_site_name AND appt_date = i_date) < (SELECT 10 *COUNT(*) FROM WORKING_AT WHERE site = i_site_name);
-- End of solution
END //
DELIMITER ;

-- ID: 13a
-- Author: dvaidyanathan6@
-- Name: view_appointments

DROP PROCEDURE IF EXISTS view_appointments;
DELIMITER //
CREATE PROCEDURE view_appointments(
    IN i_site_name VARCHAR(40),
    IN i_begin_appt_date DATE,
    IN i_end_appt_date DATE,
    IN i_begin_appt_time TIME,
    IN i_end_appt_time TIME,
    IN i_is_available INT  -- 0 for "booked only", 1 for "available only", NULL for "all"
)
BEGIN
    DROP TABLE IF EXISTS view_appointments_result;
    CREATE TABLE view_appointments_result(

        appt_date DATE,
        appt_time TIME,
        site_name VARCHAR(40),
        location VARCHAR(40),
        username VARCHAR(40));

    INSERT INTO view_appointments_result
-- Type solution below

    select appt_date, appt_time, APPOINTMENT.site_name, location, username 
	from APPOINTMENT left join SITE on APPOINTMENT.site_name = SITE.site_name
	where (i_begin_appt_date IS NULL OR i_begin_appt_date <= appt_date ) 
		AND (i_end_appt_date IS NULL OR i_end_appt_date >= appt_date) 
        AND (i_begin_appt_time IS NULL OR i_begin_appt_time <= appt_time) 
        AND (i_end_appt_time IS NULL OR i_end_appt_time >= appt_time)
        AND (i_site_name IS NULL OR i_site_name = APPOINTMENT.site_name)
        AND (i_is_available IS NULL OR (i_is_available = 0 AND username IS NOT NULL) OR (i_is_available = 1 AND username IS NULL));

-- End of solution
END //
DELIMITER ;


-- ID: 14a
-- Author: kachtani3@
-- Name: view_testers
DROP PROCEDURE IF EXISTS view_testers;
DELIMITER //
CREATE PROCEDURE view_testers()
BEGIN
    DROP TABLE IF EXISTS view_testers_result;
    CREATE TABLE view_testers_result(

        username VARCHAR(40),
        name VARCHAR(80),
        phone_number VARCHAR(10),
        assigned_sites VARCHAR(255));

    INSERT INTO view_testers_result
-- Type solution below
    SELECT sitetester_username, CONCAT(fname, " ", lname), phone_num, GROUP_CONCAT(site)
	FROM ((SITETESTER LEFT JOIN EMPLOYEE ON (sitetester_username = emp_username)) LEFT JOIN USER ON (username = emp_username)) LEFT JOIN WORKING_AT ON (sitetester_username = WORKING_AT.username)
	GROUP BY sitetester_username;
-- End of solution
END //
DELIMITER ;

-- ID: 15a
-- Author: kachtani3@
-- Name: create_testing_site
DROP PROCEDURE IF EXISTS create_testing_site;
DELIMITER //
CREATE PROCEDURE create_testing_site(
	IN i_site_name VARCHAR(40),
    IN i_street varchar(40),
    IN i_city varchar(40),
    IN i_state char(2),
    IN i_zip char(5),
    IN i_location varchar(40),
    IN i_first_tester_username varchar(40)
)
BEGIN
-- Type solution below
	INSERT INTO SITE(site_name, street, city, state, zip, location)
    SELECT i_site_name, i_street, i_city, i_state, i_zip, i_location 
    FROM DUAL
    WHERE EXISTS(SELECT * FROM SITETESTER WHERE sitetester_username = i_first_tester_username); 
	
    INSERT INTO WORKING_AT(username, site)
    SELECT i_first_tester_username, i_site_name
    FROM DUAL
    WHERE EXISTS(SELECT * FROM SITETESTER WHERE sitetester_username = i_first_tester_username);
-- End of solution
END //
DELIMITER ;

-- ID: 16a
-- Author: kachtani3@
-- Name: pool_metadata
DROP PROCEDURE IF EXISTS pool_metadata;
DELIMITER //
CREATE PROCEDURE pool_metadata(
    IN i_pool_id VARCHAR(10))
BEGIN
    DROP TABLE IF EXISTS pool_metadata_result;
    CREATE TABLE pool_metadata_result(
        pool_id VARCHAR(10),
        date_processed DATE,
        pooled_result VARCHAR(20),
        processed_by VARCHAR(100));

    INSERT INTO pool_metadata_result
-- Type solution below
    SELECT pool_id, process_date, pool_status as pooled_result, concat(fname, ' ', lname) as processed_by 
    FROM POOL left join USER on (USER.username = POOL.processed_by) 
    WHERE pool_id = i_pool_id;
-- End of solution
END //
DELIMITER ;

-- ID: 16b
-- Author: kachtani3@
-- Name: tests_in_pool
DROP PROCEDURE IF EXISTS tests_in_pool;
DELIMITER //
CREATE PROCEDURE tests_in_pool(
    IN i_pool_id VARCHAR(10))
BEGIN
    DROP TABLE IF EXISTS tests_in_pool_result;
    CREATE TABLE tests_in_pool_result(
        test_id varchar(7),
        date_tested DATE,
        testing_site VARCHAR(40),
        test_result VARCHAR(20));

    INSERT INTO tests_in_pool_result
-- Type solution below
    SELECT test_id, appt_date, appt_site, test_status FROM TEST WHERE pool_id = i_pool_id;
-- End of solution
END //
DELIMITER ;

-- ID: 17a
-- Author: kachtani3@
-- Name: tester_assigned_sites
DROP PROCEDURE IF EXISTS tester_assigned_sites;
DELIMITER //
CREATE PROCEDURE tester_assigned_sites(
    IN i_tester_username VARCHAR(40))
BEGIN
    DROP TABLE IF EXISTS tester_assigned_sites_result;
    CREATE TABLE tester_assigned_sites_result(
        site_name VARCHAR(40));

    INSERT INTO tester_assigned_sites_result
-- Type solution below

    SELECT site FROM working_at
    where username = i_tester_username;

-- End of solution
END //
DELIMITER ;

-- ID: 17b
-- Author: kachtani3@
-- Name: assign_tester
DROP PROCEDURE IF EXISTS assign_tester;
DELIMITER //
CREATE PROCEDURE assign_tester(
	IN i_tester_username VARCHAR(40),
    IN i_site_name VARCHAR(40)
)
BEGIN
-- Type solution below
	if not exists(select * from working_at where username = i_tester_username and site = i_site_name) then
	insert into working_at values(
    i_tester_username, i_site_name);
    end if;
-- End of solution
END //
DELIMITER ;


-- ID: 17c
-- Author: kachtani3@
-- Name: unassign_tester
DROP PROCEDURE IF EXISTS unassign_tester;
DELIMITER //
CREATE PROCEDURE unassign_tester(
	IN i_tester_username VARCHAR(40),
    IN i_site_name VARCHAR(40)
)
BEGIN
-- Type solution below
	if exists(select * from working_at where site = i_site_name and not username = i_tester_username) then
    delete from working_at
    where username = i_tester_username and site = i_site_name;
    end if;
-- End of solution
END //
DELIMITER ;


-- ID: 18a
-- Author: lvossler3
-- Name: daily_results
DROP PROCEDURE IF EXISTS daily_results;
DELIMITER //
CREATE PROCEDURE daily_results()
BEGIN
	DROP TABLE IF EXISTS daily_results_result;
    CREATE TABLE daily_results_result(
		process_date date,
        num_tests int,
        pos_tests int,
        pos_percent DECIMAL(6,2));
	INSERT INTO daily_results_result
    -- Type solution below
	SELECT process_date, count(test_id), count(if(test_status like 'positive',1,null)), 100 * count(if(test_status like 'positive',1,null))/count(test_id)
    FROM pool natural join test
    group by process_date
    having process_date is not null;
    -- End of solution
    END //
    DELIMITER ;














