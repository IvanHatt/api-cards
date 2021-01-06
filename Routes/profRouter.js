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

//delete a prof post
router.delete("/:id", authMiddleware, async (req, res) => {
  const prof = await Prof.findOneAndRemove({
    profId: req.params.id,
    user_id: req.user._id,
  });
  if (!prof)
    return res.status(404).send("The post with the given Id was not found");
  res.send("Post succesfully deleted!");
});

// update a prof post
router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = joiValidateProf(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let prof = await Prof.findOneAndUpdate(
    { profId: req.params.id, user_id: req.user._id },
    req.body
  );
  if (!prof)
    return res.status(404).send("The post with the given Id was not found");

  prof = await Prof.findOne({
    profId: req.params.id,
    user_id: req.user._id,
  });

  res.send(prof);
});

// get a specific prof post by profId
router.get("/:id", authMiddleware, async (req, res) => {
  const prof = await Prof.findOne({
    profId: req.params.id,
    user_id: req.user._id,
  });
  if (!prof)
    return res.status(404).send("The Post with the given ID was not found.");
  res.send(prof);
});

// create a prof posting
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