const mysql = require("mysql");
var conn = mysql.createConnection({
  host: "34.125.133.162",
  user: "root",
  password: "S^UkfC~}f8IZF{&$",
  database: "practica2",
  port: "3306",
});
conn.connect(function (err) {
  if (err) throw err;
  console.log("Connection succesfull Mysql");
});

module.exports = conn;
