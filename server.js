"use strict";
require("dotenv").config({ path: "../sample.env" });
const express = require("express");
const myDB = require("./connection");
const passport = require("passport");
const session = require("express-session");
const fccTesting = require("./freeCodeCamp/fcctesting.js");

const app = express();

fccTesting(app); //For FCC testing purposes
app.set("view engine", "pug");
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "42",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.route("/").get((req, res) => {
  const ObjValues = {
    title: "Hello",
    message: "Please login",
  };
  res.render("../views/pug", ObjValues);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
