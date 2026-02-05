var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
var validator = require('validator');
const jwt = require('jsonwebtoken');
const requireAuth = require('../middleware/auth');

const User = require("../models/User");

router.post('/register', async function (req, res) {
  const { name, email, password } = req.body;

  console.log(name, email, password);

  if (!name || !email || !password){
    console.log("fields not provided");
    return res
      .status(400)
      .json({ message: "Required fields are not provided" });
  }

  if(!validator.isEmail(email)){
    console.log("not valid email");
    return res.status(400).json({message: "not valid email"});
  }


  try {
    const existingUser = await User.findOne({email});;
    if (existingUser)
      return res
        .status(409)
        .json({ message: "User with provided email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({name, email, password: hashedPassword});

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Failed to register user", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Required fields are not provided" });

  try {
    const existingUser = await User.findOne({email});
    if (!existingUser)
      return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, existingUser.password);

    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email
      }
    });
  } catch (err) {
    console.error("Failed to login user", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/profile", requireAuth, async function (req, res) {
    console.log(req.user);
  return res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
  });
});

module.exports = router;