const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
//1. we export User and validate function from the mdoels/user folder
const { User, validate } = require("../models/user");

//2. We also need mongoose, express and router
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//3. These are all the routes

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Checking email : Email should be unique
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["fullName", "userName", "email", "password", "phone", "homeTown"]));

  console.log(user);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  // Send the response back to the user
  const token = user.generateAuthToken();

  res.send(_.pick(user, ["_id", "fullName", "userName", "email", "phone", "homeTown"]));
});

router.get("/test", async (req, res) => {
  console.log(process.pid);
});

// 4. Finally we need to export this router

module.exports = router;
