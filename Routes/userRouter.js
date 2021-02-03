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

///add profId to myfavorites array
router.put("/:profId", authMiddleware, async (req, res) => {
  const { error } = joiValidateFavProf(req.params.profId);
  if (error) return res.status(400).send(error.details[0].message);
  let myFavs = await User.findById(req.user._id, "favoriteProfs");
  if (myFavs && myFavs.favoriteProfs.includes(req.params.profId))
    return res.status(404).send("Already a favorite!");

  let updateFav = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { favoriteProfs: req.params.profId } }
  );
  if (!updateFav) return res.status(404).send("Unauthorized");

  updateFav = await User.findById(req.user._id);

  res.send("Added!");
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

// get data about the user itself
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); //exclude password from query
  res.send(user);
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

module.exports = router;
