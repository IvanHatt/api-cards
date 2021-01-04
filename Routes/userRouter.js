const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, joiValidateUser } = require("../models/userModel");

router.post("/", async (req, res) => {
  const { error } = joiValidateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.status(400).send("User already registered");

  let user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  res.send(user);
});

module.exports = router;
