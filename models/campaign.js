const config = require('config');
const jwt = require('jsonwebtoken');

const Joi = require('joi');
const mongoose = require('mongoose');
const { campaigntypeSchema } = require("./campaigntype");

// Schema deinition: defines how a schema look like
const campaignSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  campaigntype: {
    type: { campaigntypeSchema },
    required: true,
  },
  campaignImage: {
    type: String,
  },
  isApproved: Boolean
});

const Campaign = mongoose.model('Campaign', campaignSchema);

function validateCampaign(campaign) {
  const schema = {
    userId: Joi.string().min(2).max(50).required(),
    title: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(50).required(),
    campaigntypeId: Joi.objectId().required(),
    campaignImage: Joi.string(),

  };

  return Joi.validate(campaign, schema);
}

exports.Campaign = Campaign;
exports.validate = validateCampaign;