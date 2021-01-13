const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  User,
  joiValidateUser,
  joiValidateFavProf,
} = require("../models/userModel");
const { authMiddleware } = require("../middleware/authMiddleware");
const { Prof, joiValidateProf } = require("../models/profModel");

//
const getFavoriteProfs = async (favProfsArray) => {
  const favProfs = await Prof.find({ profId: { $in: favProfsArray } });
  return favProfs;
};

// get an array of prof by profId passed as ?numbers in the query
router.get("/profs", authMiddleware, async (req, res) => {
  if (!req.query.numbers) res.status(400).send("Missing numbers data");

  let data = {};
  data.favoriteProfs = req.query.numbers.split(",");

  const favoriteProfs = await getFavoriteProfs(data.favoriteProfs);
  res.send(favoriteProfs);
});

//add prof to favorites
router.patch("/profs", authMiddleware, async (req, res) => {
  const { error } = joiValidateFavProf(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const favoriteProfs = await getFavoriteProfs(req.body.favoriteProfs);
  if (favoriteProfs.length != req.body.favoriteProfs.length)
    res.status(400).send("Post numbers don't match");

  let user = await User.findById(req.user._id);
  user.favoriteProfs = req.body.favoriteProfs;
  user = await user.save();
  res.send(user);
});

// get data about the user itself
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); //exclude password from query
  res.send(user);
});

//registration
router.post("/", async (req, res) => {
  const { error } = joiValidateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.status(400).send("User already registered");

  let dataUser = _.pick(req.body, [
    "firstName",
    "lastName",
    "email",
    "password",
    "prof",
    "favoriteProfs",
  ]);
  let user = new User(dataUser);
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  res.send(_.pick(user, ["_id", "firstName", "email"]));
});

module.exports = router;
