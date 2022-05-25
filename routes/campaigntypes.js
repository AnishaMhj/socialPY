const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Campaigntype, validate } = require("../models/campaigntype");
const { Campaign } = require("../models/campaign");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    const campaigns = await Campaigntype.find().select("-__v").sort("name");
    res.send(campaigns);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let uniqueCampaign = await Campaigntype.findOne({ name: req.body.name });
    if (uniqueCampaign) return res.status(400).send("Campaign type already existss.");

    let campaigntype = new Campaigntype({ name: req.body.name });
    campaigntype = await campaigntype.save();

    res.send(campaigntype);
});



router.get("/:id", validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id).select("-__v");

    if (!genre)
        return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
});


router.delete("/:id", [validateObjectId], async (req, res) => {
    const campaigntype = await Campaigntype.findByIdAndRemove(req.params.id);

    if (!campaigntype)
        return res.status(404).send("The genre with the given ID was not found.");

    res.send(campaigntype);
});

module.exports = router;
