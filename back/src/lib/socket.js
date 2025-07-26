import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL, // Your React/Web App development origin
      process.env.APP, // Example: 
      process.env.APP2, // Another common Expo port
      process.env.APP3, // For Expo Go and dev clients (more flexible but be careful)
      null,
    ],
  },
});
const usersocketMap = {};
const getusersocketid = (id) => {
  return usersocketMap[id];
};
io.on("connection", (socket) => {
  console.log("a user is connected", socket.id);
  const userid = socket.handshake.query.userID;
  if (userid) usersocketMap[userid] = socket.id;
  io.emit("onlineusers", Object.keys(usersocketMap));
  socket.on("disconnect", () => {
    console.log("user disconnect", socket.id);
    delete usersocketMap[userid];
    io.emit("onlineusers", Object.keys(usersocketMap));
  });
});
export { io, server, app, getusersocketid };
