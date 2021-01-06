const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  profKeywords: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
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
});

const Prof = mongoose.model("Prof", profSchema);

function joiValidateProf(prof) {
  const schema = Joi.object({
    profName: Joi.string().min(2).max(255).required(),
    profTitle: Joi.string().min(2).max(255).required(),
    profEducation: Joi.string().min(2).max(255).required(),
    profDescription: Joi.string().min(2).max(1024).required(),
    profEmail: Joi.string().min(6).max(255).required().email(),
    profPhone: Joi.string().min(9).max(15).required(),
    profImage: Joi.string().min(11).max(1024).required(),
    profKeywords: Joi.string().min(2).max(255).required(),
    profPrice: Joi.string().min(1).max(4).required(),
  });
  return schema.validate(prof);
}

exports.Prof = Prof;
exports.joiValidateProf = joiValidateProf;