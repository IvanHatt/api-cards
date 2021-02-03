const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { User } = require("../models/userModel");
const {
  Prof,
  joiValidateProf,
  generateProfId,
  avatarImg,
} = require("../models/profModel");
const { authMiddleware } = require("../middleware/authMiddleware");

//get all profs, even if not connected
router.get("/all-profs", async (req, res) => {
  const allProfs = await Prof.find();
  res.send(allProfs);
});

//get my profs , only the owner
router.get("/my-profs", authMiddleware, async (req, res) => {
  if (!req.user.prof) return res.status(401).send("Acces Denied");
  const profs = await Prof.find({ user_id: req.user._id });
  res.send(profs);
});

//get favorites, the owner
router.get("/myfav-profs", authMiddleware, async (req, res) => {
  let myFavs = await User.findById(req.user._id, "favoriteProfs");
  if (myFavs && myFavs.favoriteProfs.length > 0) {
    const favProfs = await Prof.find({ profId: { $in: myFavs.favoriteProfs } });
    res.send(favProfs);
  }
  res.status(404).send("No favorites found");
});

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
  if (!prof) return res.status(404).send("Unauthorized");

  prof = await Prof.findOne({
    profId: req.params.id,
    user_id: req.user._id,
  });

  res.send(prof);
});

// create a prof posting
router.post("/", authMiddleware, async (req, res) => {
  const { error } = joiValidateProf(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let prof = new Prof({
    profName: req.body.profName,
    profTitle: req.body.profTitle,
    profCity: req.body.profCity,
    profDescription: req.body.profDescription,
    profEmail: req.body.profEmail,
    profPhone: req.body.profPhone,
    profImage: req.body.profImage ? req.body.profImage : avatarImg,
    profPrice: req.body.profPrice,
    profId: await generateProfId(Prof),
    user_id: req.user._id,
  });

  await prof.save();
  res.send("Saved");
});

// get a specific prof post by profId
router.get("/:id", authMiddleware, async (req, res) => {
  const prof = await Prof.findOne({
    profId: req.params.id,
    user_id: req.user._id,
  });
  if (!prof)
    return res.status(404).send("The Post with the given ID was not found");
  res.send(prof);
});

module.exports = router;
