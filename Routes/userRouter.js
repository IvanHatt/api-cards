const express = require("express");
const router = express.Router();
const { User, joiValidateUser } = require("../models/userModel");

router.post("/", async (req, res) => {
  const { error, value } = joiValidateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  //******//
  console.log(value);
  //****//
});

module.exports = router;
