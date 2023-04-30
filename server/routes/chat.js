const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const User = require("../models/user");

router.get("/get/:id1/:id2/", async (req, res) => {
  try {
    let loggedUser = await User.findById(req.params.id1);
    let contactUser = await User.findById(req.params.id2);

    let usersDetails = [
      {
        id: contactUser._id,
        avatarURL: contactUser.avatarURL,
        username: contactUser.username,
        activityStatus: {
          currentStatus: contactUser.activityStatus.currentStatus,
        },
      },
      {
        id: loggedUser._id,
        avatarURL: loggedUser.avatarURL,
        username: loggedUser.username,
        activityStatus: {
          currentStatus: loggedUser.activityStatus.currentStatus,
        },
      },
    ];

    if (!loggedUser.contacts.find((el) => el.id == contactUser._id)) {
      loggedUser.contacts.unshift({ ...usersDetails[0], type: "temporary" });
    }
    await loggedUser.save();

    let chat = await Chat.findOne({
      users: { $all: [loggedUser._id, contactUser._id] },
    });

    if (chat) {
      if (
        chat.messages.some(
          (el) => el.read.findIndex((el2) => el2 === req.params.id1) === -1
        )
      ) {
        await Chat.findByIdAndUpdate(chat._id, {
          $addToSet: { "messages.$[].read": req.params.id1 },
        });
      }
      return res.json({
        contactUser: usersDetails[0],
        loggedUser: usersDetails[1],
        _id: chat._id,
        messages: [],
        call: chat.call,
      });
    }

    let newChat = new Chat({
      users: [loggedUser._id, contactUser._id],
      usersDetails,
      messages: [
        {
          author: req.params.id1,
          date: new Date().toISOString(),
          content: "Example message example message",
          read: [req.params.id1, req.params.id2],
        },
        {
          author: req.params.id2,
          date: new Date().toISOString(),
          content: "Example message example message",
          read: [req.params.id1, req.params.id2],
        },
      ],
    });

    await newChat.save();

    res.json({
      contactUser: usersDetails[0],
      loggedUser: usersDetails[1],
      _id: newChat._id,
      messages: [],
    });
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/messages/:chatroomid/:messagesLength", async (req, res) => {
  try {
    let chat = await Chat.findById(req.params.chatroomid);
    let messagesPerFetch = 16;

    let messages = chat.messages.slice(
      req.params.messagesLength,
      parseInt(req.params.messagesLength) + messagesPerFetch
    );

    res.json({ messages: messages, chatId: chat._id.toHexString() });
  } catch (error) {
    console.log("err", error);
  }
});

module.exports = router;
