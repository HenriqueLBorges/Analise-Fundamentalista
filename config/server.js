let express = require("express");
let consign = require("consign");
let bodyParser = require("body-parser");
let expressValidator = require("express-validator");

let app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

app.use(express.static("./app/public"));

app.set("view engine", "ejs");

app.set("views", "./app/views");

consign()
    .include("app/routes")
    .then("app/controllers")
    .then("app/views")
    .into(app);

module.exports = app;