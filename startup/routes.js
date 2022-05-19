const express = require("express");
const genres = require("../routes/genres");
const campaigntypes = require("../routes/campaigntypes");

const customers = require("../routes/customers");
const movies = require("../routes/movies");
const campaigns = require("../routes/campaigns");

const rentals = require("../routes/rentals");
const students = require("../routes/students");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const faculties = require("../routes/faculties");
const admins = require("../routes/admin");
var cors = require("cors");

const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json({ limit: "50mb" }));
  app.use("/api/genres", genres);
  app.use("/api/campaigntypes", campaigntypes);


  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/campaigns", campaigns);
  app.use("/api/rentals", rentals);
  app.use("/api/students", students);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use("/api/faculties", faculties);
  app.use("/api/admin", admins);
  app.use("/uploads", express.static("uploads"));

  // app.use(express.json({ limit: "50mb" }));
  // app.use(express.urlencoded({ limit: "50mb" }));
  app.use(cors());
  app.use(error);
};
