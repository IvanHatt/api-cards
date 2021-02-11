const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const config = require("config");
const avatarImg = "public/uploads/avatar-profile-icon-grey.jpg";

//define Mongoose Schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
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
  prof: {
    type: Boolean,
    required: true,
  },
  favoriteProfs: {
    type: Array,
  },
  profImage: { type: String, minlength: 11, maxlength: 1024 },
  createdAt: { type: Date, default: Date.now },
});

//mongoose create a new method, will be available on every instance of User
userSchema.method("generateAuthToken", function () {
  const token = jwt.sign(
    { _id: this._id, prof: this.prof, profImage: this.profImage },
    config.get("jwtKey")
  );
  return token;
});

//define mongoose model User from userSchema
const User = mongoose.model("User", userSchema);

//validation with Joi for registration (used in userRouter)
function joiValidateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    prof: Joi.boolean().required(),
    profImage: Joi.allow(null),
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

//validation for favorite prof
function joiValidateFavProf(data) {
  const schema = Joi.number().min(1000).max(999999).required();
  return schema.validate(data);
}

exports.User = User;
exports.joiValidateUser = joiValidateUser;
exports.joiValidateAuth = joiValidateAuth;
exports.joiValidateFavProf = joiValidateFavProf;
exports.avatarImg = avatarImg;
