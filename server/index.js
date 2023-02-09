const app = require("express")();
const express = require("express")
const server = require("http").createServer(app);
const mongoose = require('mongoose')
const cors = require("cors");
const jwt = require('jsonwebtoken')
require("dotenv").config();


//Socket.io
const io = require("socket.io")(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});


const handleConnect = require('./socketio/index')
io.on('connect',(socket) => handleConnect(io, socket))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    "access-control-allow-credentials": true,
  })
);

//Database
mongoose
.connect(process.env.DB_URL)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

//Routes
let authRoutes = require('./routes/auth')
let userRoutes = require('./routes/user')
let chatRoutes = require('./routes/chat')
app.use('/auth', authRoutes)
app.use('/user', authenticateToken, userRoutes)
app.use('/chat', authenticateToken, chatRoutes)


function authenticateToken(req, res, next) {
  const authHeader = req.headers["auth"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

//Listen
let port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server listening on port ${port}`));
