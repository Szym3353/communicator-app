const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Chat = require("../models/chat");
const bcrypt = require("bcrypt");

router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let user = await User.findById(id);

    let { password, ...userData } = user._doc;

    //Get contacts activitystatus
    let contactsIdArray = userData.contacts.map((el) => el.id);
    let contacts = await User.find({ _id: { $in: contactsIdArray } });

    let mappedContacts = userData.contacts.map((el, index) => ({
      ...el._doc,
      activityStatus: contacts.find(
        (contactUser) => contactUser._doc._id == el.id
      ).activityStatus,
    }));

    res.json({ ...userData, contacts: mappedContacts });
  } catch (error) {
    console.log(error);
  }
});

router.get("/search/:username?/:code?", async (req, res) => {
  try {
    let queryObject = {};
    if (req.params.username && req.params.username != "0")
      queryObject.username = { $regex: req.params.username };
    if (req.params.code) queryObject.code = { $regex: req.params.code };

    let result = await User.find(queryObject);

    res.json(
      result.map((el) => ({
        id: el._id,
        username: el.username,
        avatarURL: el.avatarURL,
        type: "temporary",
        activityStatus: { currentStatus: el.activityStatus.currentStatus },
      }))
    );
  } catch (error) {}
});

router.post("/update", async (req, res) => {
  try {
    let user = await User.findById(req.body.userId);
    if (!user) return;

    let { category, value, oldPassword, confirmNewPassword, newPassword } =
      req.body.data;

    if (
      !category ||
      !value ||
      category?.trim() === "" ||
      value?.trim() === ""
    ) {
      throw new Error("Incorrect value");
    }

    if (category === "password") {
      if (
        !oldPassword ||
        oldPassword?.trim() === "" ||
        !newPassword ||
        newPassword?.trim() === "" ||
        confirmNewPassword !== newPassword
      )
        throw new Error("Incorrect value");

      let match = await bcrypt.compare(oldPassword, user.password);
      if (!match) throw new Error("Wrong old password");

      let password = await bcrypt.hash(newPassword, 12);
      user.password = password;
    } else if (category === "phone" || category === "lastStatus") {
      user.settings = { ...user.settings, [category]: value };
    } else {
      user[category] = value;
    }

    await user.save();

    //Update users contact
    let users = await User.find({ "contacts.id": req.body.userId });

    users.forEach(async (user, index) => {
      if (user.defaultContact) return;
      let contact = user.contacts.find((el) => el.id === req.body.userId);
      if (Object.keys(contact._doc).includes(category)) {
        contact[category] = value;
      }
      await user.save();
    }, users);

    let { pasword, ...userData } = user._doc;
    res.send(userData);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
