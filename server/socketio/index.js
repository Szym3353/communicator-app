const User = require("../models/user");
const userHandler = require("./user");
const chatHandler = require("./chat");

module.exports = (io, socket) => {
  console.log("connected user: ", socket.id);
  userHandler(io, socket);
  chatHandler(io, socket);

  socket.on("disconnect", async () => {
    let user = await User.findOneAndUpdate(
      { "activityStatus.socketId": socket.id },
      { activityStatus: { currentStatus: "offline", socketId: "" } }
    );

    if (user) {
      user.contacts.forEach(async (el) => {
        if (el.defaultContact) return;

        let contactUser = await User.findById(el.id);

        if (
          contactUser.activityStatus.currentStatus === "offline" ||
          contactUser.activityStatus.socketId === ""
        )
          return;

        io.to(contactUser.activityStatus.socketId).emit(
          "contact:changeStatus",
          {
            contactId: user._id,
            status: "offline",
          }
        );
      });
    }
  });
};
