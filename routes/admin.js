//2. We also need mongoose, express and router
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const { Campaign } = require("../models/campaign");


//3. These are all the routes
router.post("/login", async (req, res) => {
    let user = await User.findOne({ email: req.body.username });
    let userPhone = await User.findOne({ phone: req.body.phone });
    let isAdmin = user.isAdmin;
    let isAdminPhone = userPhone.isAdmin;
    console.log(isAdmin);
    if (!user || !userPhone) return res.status(400).send("User Not Registered");
    if (!isAdmin || !isAdminPhone) return res.status(400).send("User is not an admin");
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password");
    res.send(_.pick(user, ["_id", "name", "email", "phone", "isAdmin"]));
});

router.get("/getAllCampaigns", async (req, res) => {
    const campaigns = await Campaign.find().select("-__v").sort("-createdDate");
    res.send(campaigns);
})

router.get("/", async (req, res) => {
    res.send("Hello Admin");
});



module.exports = router;