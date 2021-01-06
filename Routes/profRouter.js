const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  Prof,
  joiValidateProf,
  generateProfId,
  avatarImg,
} = require("../models/profModel");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  const { error } = joiValidateProf(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let prof = new Prof({
    profName: req.body.profName,
    profTitle: req.body.profTitle,
    profEducation: req.body.profEducation,
    profDescription: req.body.profDescription,
    profEmail: req.body.profEmail,
    profPhone: req.body.profPhone,
    profImage: req.body.profImage ? req.body.profImage : avatarImg,
    profKeywords: req.body.profKeywords,
    profPrice: req.body.profPrice,
    profId: await generateProfId(Prof),
    user_id: req.user._id,
  });

  let profToDb = await prof.save();
  res.send("Saved" + prof);
});

module.exports = router;
