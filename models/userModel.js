const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const config = require("config");

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
    type: String,
    minlength: 10,
    maxlength: 20,
  },
  prof: {
    type: Boolean,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

//mongoose create a new method, will be available on every instance of User
userSchema.method("generateAuthToken", function () {
  const token = jwt.sign(
    { _id: this._id, prof: this.prof },
    config.get("jwtKey")
  );
  return token;
});

//define mongoose model User from userSchema
const User = mongoose.model("User", userSchema);

//validation with Joi for registration (used in userRouter)
function joiValidateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    phone: Joi.string().min(10).max(20),
    prof: Joi.boolean().required(),
  });

  return schema.validate(user);
}

//validation with Joi for signin (used in authRouter)

function joiValidateAuth(req) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(req);
}

exports.User = User;
exports.joiValidateUser = joiValidateUser;
exports.joiValidateAuth = joiValidateAuth;
