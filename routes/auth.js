const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
//1. we export User and validate function from the mdoels/user folder
const { User } = require("../models/user");

//2. We also need mongoose, express and router
const mongoose = require("mongoose");
const express = require("express");
const string = require("joi/lib/types/string");
const router = express.Router();

//3. These are all the routes.
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.username });
  let userPhone = await User.findOne({ phone: req.body.phone });
  if (!user || !userPhone) return res.status(400).send("User Not Registered");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  res.send(_.pick(user, ["_id", "name", "email", "phone"]));
}
);

function validate(req) {
  const schema = {
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(req, schema);
}

// 4. Finally we need to export this router

module.exports = router;
