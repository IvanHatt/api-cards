const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

//define Mongoose Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  phone: {
    type: Number,
    minlength: 10,
    maxlength: 20,
  },
  prof: {
    type: Boolean,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

//define mongoose model User from userSchema
const User = mongoose.model("User", userSchema);

//validation with Joi
function joiValidateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    phone: Joi.number().min(10).max(20),
    prof: Joi.boolean().required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.joiValidateUser = joiValidateUser;
