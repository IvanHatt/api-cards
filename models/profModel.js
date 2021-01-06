const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { User } = require("../models/userModel");
const _ = require("lodash");
const avatarImg =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const profSchema = new Schema({
  profName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  profTitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  profEducation: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  profDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  profEmail: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  profPhone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 15,
  },
  profImage: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  profKeywords: [
    {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
  ],
  profPrice: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 4,
  },
  profId: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999,
    unique: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: User, //ver si funciona(si no, hacerlo como en el libro)
  },
});

const Prof = mongoose.model("Prof", profSchema);

function joiValidateProf(prof) {
  const schema = Joi.object({
    profName: Joi.string().min(2).max(255).required(),
    profTitle: Joi.string().min(2).max(255).required(),
    profEducation: Joi.string().min(2).max(255).required(),
    profDescription: Joi.string().min(2).max(1024).required(),
    profEmail: Joi.string().min(6).max(255).required().email(),
    profPhone: Joi.string()
      .min(9)
      .max(15)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    profImage: Joi.string().min(11).max(1024),
    profKeywords: Joi.array().items(Joi.string().min(2).max(20)).required(),
    profPrice: Joi.string().min(1).max(4).required(),
  });
  return schema.validate(prof);
}

async function generateProfId(Prof) {
  while (true) {
    let randomNumber = _.random(1000, 999999);
    let prof = await Prof.findOne({ ProfId: randomNumber });
    if (!prof) return String(randomNumber);
  }
}

exports.Prof = Prof;
exports.joiValidateProf = joiValidateProf;
exports.generateProfId = generateProfId;
exports.avatarImg = avatarImg;
