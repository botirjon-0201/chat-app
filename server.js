const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.send("Chat Server is running.");
});

app.get("/room/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  res.send(`Welcome to room: ${roomId}`);
});

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("join", (roomId, callback) => {
    socket.join(roomId);
    callback();
  });

  socket.on("sendMessage", (message, roomId, callback) => {
    console.log(`User sent message: ${message}`);
    io.to(roomId).emit("message", message);
    callback();
  });

  socket.on("disconnect", () => {
    console.log("User had left");
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
