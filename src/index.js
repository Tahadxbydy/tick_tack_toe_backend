import "dotenv/config";
import connectDb from "./db/connect_db.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.port || 3000;

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    console.log(`message from client: ${msg}`);
    io.emit("chat message", `${msg} ponka`);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

connectDb().then(
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
);
