const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, joiValidateUser } = require("../models/userModel");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); //exclude password from query
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = joiValidateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.status(400).send("User already registered");

  let dataUser = _.pick(req.body, [
    "name",
    "email",
    "password",
    "phone",
    "prof",
    "cards",
  ]);
  let user = new User(dataUser);
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
