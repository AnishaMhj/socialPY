const Joi = require("joi");
const mongoose = require("mongoose");

const campaigntypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
    },
});

const Campaigntype = mongoose.model("Campaigntype", campaigntypeSchema);

function validateCampaigntype(campaigntype) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
    };

    return Joi.validate(campaigntype, schema);
}

exports.campaigntypeSchema = campaigntypeSchema;
exports.Campaigntype = Campaigntype;
exports.validate = validateCampaigntype;
