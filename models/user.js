const config = require('config');
const jwt = require('jsonwebtoken');

const Joi = require('joi');
const mongoose = require('mongoose');
// Schema deinition: defines how a schema look like
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  userName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  phone: {
    type: Number,
    required: true,
    minlength: 9,
    maxlength: 15
  },
  homeTown: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 15
  },
  isAdmin: Boolean
});

// Dont worry about this
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;

}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    fullName: Joi.string().min(5).max(50).required(),
    userName: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
    phone: Joi.number().required(),
    homeTown: Joi.string().min(5).max(50).required(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;