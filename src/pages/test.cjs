var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "booking"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query('Select * from users', function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
});
//source taken from WW3 SCHOOLS REFERENCE