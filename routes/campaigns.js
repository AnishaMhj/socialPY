const { Campaign, validate } = require("../models/campaign");
const { Campaigntype } = require("../models/campaigntype");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var multer = require("multer");
var cors = require("cors");
router.get("/", async (req, res) => {
    const campaigns = await Campaign.find().select("-__v").sort("-createdDate");
    res.send(campaigns);
});

router.get("/getMoviesToRename/:id", async (req, res) => {
    const campaigntypeId = req.params.id;
    const movies = await Movie.find({
        "campaigntype._id": new mongoose.Types.ObjectId(req.params.id),
    })
        .select({ title: 1, author: 1, campaigntype: 1 })
        .sort("-createdDate");
    res.send(movies);
});

router.put("/editMoviesToRename/:id", async (req, res) => {
    const movieId = req.params.id;
    const campaigntypeId = req.body.id;
    const campaigntypeName = req.body.name;

    const result = await Movie.findByIdAndUpdate(movieId, {
        $set: {
            "campaigntype._id": campaigntypeId,
            "campaigntype.name": campaigntypeName,
        },
    });
    res.send(result);
});

// router.post("/", [auth, admin, upload.single("file")], async (req, res) => {
// router.post("/", [upload.single("file")], async (req, res) => {
router.post("/", upload.single("file"), async (req, res) => {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const campaigntype = await Campaigntype.findById(req.body.campaigntypeId);
    if (!campaigntype) return res.status(400).send("Invalid Campaign Type");

    const campaign = new Campaign({
        description: req.body.description,
        title: req.body.title,
        campaigntype: {
            _id: campaigntype._id,
            name: campaigntype.name,
        },
        userId: req.body.userId,
    });
    (req.file) ? campaign.campaignImage = req.file.path : campaign.campaignImage = "";
    campaign.isApproved = false;
    await campaign.save();

    res.send(campaign);
});

router.put("/:id", [auth, admin, upload.single("file")], async (req, res) => {
    console.log("reached here at PUT method");
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const campaigntype = await campaigntype.findById(req.body.campaigntypeId);
    if (!campaigntype) return res.status(400).send("Invalid campaigntype.");

    const data = {
        title: req.body.title,
        campaigntype: {
            _id: campaigntype._id,
            name: campaigntype.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        bookCode: req.body.bookCode,
        author: req.body.author,
        // tag: JSON.parse(req.body.tag),
    };
    const tempTag = JSON.parse(req.body.tag).map((t) => ({
        bookCode: t,
        status: "0",
    }));
    data.tag = tempTag;

    req.file ? (data.bookImage = req.file.path) : " ";
    const movie = await Movie.findByIdAndUpdate(req.params.id, data, {
        new: true,
    });

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});

router.delete("/:id", async (req, res) => {
    const campaign = await Campaign.findByIdAndRemove(req.params.id);
    if (!campaign)
        return res.status(404).send("The Campaign with the given ID was not found.");
    res.send(campaign);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const campaign = await Campaign.findById(req.params.id).select("-__v");

    if (!campaign)
        return res.status(404).send("The campaign with the given ID was not found.");

    res.send(campaign);
});
router.get("/list/:id", validateObjectId, async (req, res) => {
    const campaignListByUser = await Campaign.find({ userId: req.params.id }).select("-__v");
    console.log(campaignListByUser);

    if (!campaignListByUser)
        return res.status(404).send("Campaigns with the given ID was not found.");

    res.send(campaignListByUser);
});
module.exports = router;
