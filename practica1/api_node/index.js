const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./connection.js");
const app = express();

var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    Title: "API Nodejs - Practica 2",
  });
});

app.get("/getData", (req, res) => {
  connection.query("SELECT * FROM Dta", function (err, result) {
    if (err) throw err;
    var data = {
      ram: result[0].ram,
      cpu: result[0].cpu,
    };

    res.send(data);
  });
});

//Iniciando el servidor
app.listen(5000, () => console.log("Server on port", 5000));
