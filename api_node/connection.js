const mysql = require("mysql");
var conn = mysql.createConnection({
  host: "104.154.38.60",
  user: "root",
  password: "developer",
  database: "practica2",
  port: "3306",
});
conn.connect(function (err) {
  if (err) throw err;
  console.log("Connection succesfull Mysql");
});

module.exports = conn;
