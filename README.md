# Team 41
Andrew Johnston (ajohnston41)
Colin Keenan (ckeenan9)
Leo Ricci (lricci7)
Lewey Wilson (Lwilson67)


# Our Instructions:

To run our application for the first time, you will need to create a MySQL user under MySQL Workbench Administration with username "username" and password "password" and give them the DB Admin role on the next pane (bad practice but this is all local). If you do not do this, you will need to replace the parameters in lines 13 and 14 of server.js with the credentials of a user in your MySQL instance who has full priveledges to the "covidtest_fall2020" database.

Our Phase 4 implementation was developed using the latest version of the "covidtest_fall2020" database, created using the db_init file on Canvas. For Phase 4, despite receiving a 100% on Phase 3, we rewrote some procedures in order to more gracefully handle errors in the frontend (rather than successfully updating zero rows). Because of this, **you will need to add our procedures to your database using "phase3_shell.sql"** located in the root of our team repo, just one level above the Phase 4 directory.

# 1. Running the API/Backend Server:

Make sure to do this before starting the React frontend. Open a terminal window in the phase4 directory and run:

### `node server.js`

You should get feedback in the log stating if it was able to connect to MySQL, and if successful you will see the hosting address and port for the backend. After this you can run proceed to start the frontend with "npm start" as usual to startup and locally host the frontend. You will need to leave this open. To stop the server, use ctrl+C.

# 2. Running the React Frontend:

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the phase4 directory, you can run:

### `npm start`

This runs the app locally in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Technologies Used

We chose to implement Phase 4 as a webapp. We used React and TypeScript as our respective frontend framework and language. For the backend we used NodeJS and Express to implement a simple API to interfact with the MySQL database we have been working with throughout the semester.

# Work Distribution

Throughout the project, the team has tried to split our workloads as evenly as possible. During Phase 1 and Phase 2, we spent time in virtual meetings working together and discussing the database design. During Phases 3 and 4, we split the queries and screens evenly between the group members. We all attempted to create our pages and fit them into the application, and whenever one of us ran into any issues with our pages, the group as a whole did a great job helping each other out. \
Special shoutout to Andrew Johnston for getting our Express server up and working so we could connect to our MySQL database. Other than that one unique task, the actual implementation of the web application was distributed relatively evenly between the whole group.
