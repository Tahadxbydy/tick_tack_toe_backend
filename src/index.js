import "dotenv/config";
import connectDb from "./db/connect_db.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { roomModel } from "./model/Room.model.js";
import { asyncHandler } from "./asyncHandler.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.port || 3000;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("create room", async ({ nickname }) => {
    console.log(nickname);
    try {
      var room = new roomModel();
      var player = { socketId: socket.id, name: nickname, playerType: "x" };
      room.player.push(player);
      room.turn = player;
      room = await room.save();
      const roomId = room._id;
      socket.join(roomId.toString());
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      io.to(roomId.toString()).emit("room created", room);
      console.log(`Room created by ${nickname}`);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("join room", async ({ nickname, roomId }) => {
    console.log(`Room joined by ${nickname}`);
    try {
      if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        socket.emit("Error: RoomId is not correct");
      }
      var room = await roomModel.findById(roomId);
      if (!room) {
        socket.emit("Error: Cannot find the room");
      }
      if (room.isJoin) {
        const player = {
          name: nickname,
          socketId: socket.id,
          playerType: "o",
        };
        socket.join(roomId);
        room.player.push(player);
        room.isJoin = false;
        room = await room.save();
        io.to(roomId).emit("room joined", room);
        console.log(`Room joined by ${nickname}`);
      } else {
        socket.emit("Error: Match Is Already In Progress");
      }
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("player move", async ({ index, type, roomId }) => {
    try {
      if (!index || !type) {
        socket.emit("Error", "Error: index or type not provided");
      }
      var room = await roomModel.findById(roomId);
      if (!room) {
        socket.emit("Error", "cantfind the room");
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
app.use(express.json());

connectDb().then(
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
);
