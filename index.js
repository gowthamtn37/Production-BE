import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { getMessage } from "./service/users.service.js";

import usersRouter from "./router/users.router.js";
import machineRouter from "./router/machine.router.js";

export const app = express();
export const httpServer = createServer(app);

const PORT = process.env.PORT;

const mongo_URL = process.env.mongo_URL;
export const Client = new MongoClient(mongo_URL);
await Client.connect();
console.log("Connected to MongoDB");

app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use("/machine", machineRouter);
const io = new Server(httpServer, {
  cors: {
    origin: "https://exquisite-froyo-600594.netlify.app",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});
io.on("connection", async (socket) => {
  //console.log("user connected");

  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });

  setInterval(async () => {
    socket.emit("send_msg", await getMessage());
  }, 1000);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
