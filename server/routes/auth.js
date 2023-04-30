const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");

function generateCode(length) {
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.email },
    process.env.ACCESS_TOKEN_SECRET
  );
}

let statusArray = ["online", "offline", "away", "doNotDisturb", "hidden"];

router.get("/generate", async (req, res) => {
  await fetch(
    "https://randomuser.me/api/?inc=name,name,location,picture,registered",
    { method: "GET" }
  )
    .then((result) => result.json())
    .then((data) => {
      let results = data.results[0];

      let newUser = new User({
        username: `${results.name.first} ${results.name.last}`,
        avatarURL: results.picture.large,
        city: results.location.city,
        country: results.location.country,
        defaultContact: true,
        registered: results.registered.date,
        activityStatus: {
          currentStatus:
            statusArray[Math.floor(Math.random() * statusArray.length)],
        },
      });

      newUser.save();
      res.send(newUser);
    });
});

router.post("/register", async (req, res) => {
  //Form validation
  let inputErrors = {};

  if (!req.body.username || req.body.username.trim() === "")
    inputErrors.username = "Username can't be empty";
  if (!req.body.email || req.body.email.trim() === "")
    inputErrors.email = "E-mail adress can't be empty";
  if (!req.body.password || req.body.password.trim() === "")
    inputErrors.password = "Password can't be empty";
  if (req.body.password !== req.body.confirmPassword)
    inputErrors.confirmPassword = "Passwords are not the same";
  let checkUsername = await User.exists({ username: req.body.username });
  if (checkUsername) inputErrors.username = "Username already taken";
  let checkEmail = await User.exists({ email: req.body.email });
  if (checkEmail) inputErrors.email = "E-mail adress already taken";

  if (Object.keys(inputErrors).length > 0) {
    return res.status(400).send(inputErrors);
  }

  //Create new user
  let password = await bcrypt.hash(req.body.password, 12);

  //Get default contacts
  let defConts = await User.find({ defaultContact: true });

  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    code: generateCode(6),
    password,
    avatarURL:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    city: "Not set",
    country: "Not set",
    registered: new Date().toISOString(),
    contacts: defConts.map((el) => ({
      username: el.username,
      avatarURL: el.avatarURL,
      newMessage: false,
      id: el._id,
      contactType: "friend",
      defaultContact: true,
    })),
  });

  let user = await newUser.save();
  let token = generateToken(user);
  res.json({ token });
});

router.post("/login", async (req, res) => {
  console.log("test?");
  //Form validation
  let inputErrors = {};
  if (!req.body.email || req.body.email.trim() === "")
    inputErrors.email = "E-mail adress can't be empty";
  if (!req.body.password || req.body.password.trim() === "")
    inputErrors.password = "Password can't be empty";

  if (Object.keys(inputErrors).length > 0) {
    return res.status(400).send(inputErrors);
  }

  //Get user data
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ email: "User does not exists" });

  let match = await bcrypt.compare(req.body.password, user.password);
  if (!match)
    return res.status(400).send({ password: "Incorrect credentials" });

  const token = generateToken(user);
  res.json({ token });
});

module.exports = router;
