import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

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

const result = await Client.db("cnc_company")
  .collection("products")
  .find()
  .sort({ _id: -1 })
  .limit(1)
  .toArray();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});
io.on("connection", (socket) => {
  socket.emit("send_msg", result);
});

app.use("/users", usersRouter);
app.use("/machine", machineRouter);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
