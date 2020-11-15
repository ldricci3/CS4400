const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const cors = require('cors');
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

require('./routes/html-routes')(app, connection);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
