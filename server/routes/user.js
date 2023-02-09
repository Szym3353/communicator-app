const express = require("express");
const router = express.Router();
const User = require("../models/user");

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
  console.log("SEARCH", req.params);
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

module.exports = router;
