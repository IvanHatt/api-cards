const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { User } = require("../models/userModel");
const _ = require("lodash");
const config = require("config");

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
  profCity: {
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
    profTitle: Joi.string()
      .valid(...config.get("categories"))
      .min(2)
      .max(255)
      .required(),
    profCity: Joi.string()
      .valid(...config.get("cities"))
      .min(2)
      .max(255)
      .required(),
    profDescription: Joi.string().min(2).max(1024).required(),
    profEmail: Joi.string().min(6).max(255).required().email(),
    profPhone: Joi.string()
      .min(9)
      .max(15)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
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
