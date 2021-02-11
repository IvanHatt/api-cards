const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  User,
  joiValidateUser,
  joiValidateFavProf,
  avatarImg,
} = require("../models/userModel");
const { authMiddleware } = require("../middleware/authMiddleware");
const { upload } = require("../helper/upload-config");

///add profId to myfavorites array
router.put("/add-fav/:profId", authMiddleware, async (req, res) => {
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

///remove profId from myfavorites array
router.put("/delete-fav/:profId", authMiddleware, async (req, res) => {
  const { error } = joiValidateFavProf(req.params.profId);
  if (error) return res.status(400).send(error.details[0].message);
  let myFavs = await User.findById(req.user._id, "favoriteProfs");
  if (myFavs && !myFavs.favoriteProfs.includes(req.params.profId))
    return res.status(404).send("Not a favorite!");

  let updateFav = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { favoriteProfs: req.params.profId } }
  );
  if (!updateFav) return res.status(404).send("Unauthorized");

  updateFav = await User.findById(req.user._id);

  res.send("Deleted!");
});

//registration
router.post("/", upload.single("profImage"), async (req, res) => {
  const { error } = joiValidateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.status(400).send("User already registered");

  try {
    let dataUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      prof: req.body.prof,
      profImage: avatarImg,
      favoriteProfs: [],
    };
    if (req.body.prof && req.file) {
      dataUser.profImage = req.file.path;
    }

    let user = new User(dataUser);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    res.send(_.pick(user, ["_id", "firstName", "email"]));
  } catch (error) {
    res.status(500).send("Error");
  }
});

// image available at : `http://localhost:3010/api/profs/${prof.profImage}`

// get data about the user itself
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); //exclude password from query
  res.send(user);
});

module.exports = router;
