import express from "express";
import { MongoClient, Timestamp } from "mongodb";
import cors from "cors";
import Joi from "joi";
//import mongoose from "mongoose";
import usersRouter from "./router/users.router.js";
import machineRouter from "./router/machine.router.js";

const app = express();
const PORT = process.env.PORT;

const mongo_URL = process.env.mongo_URL;
export const Client = new MongoClient(mongo_URL);
await Client.connect();
console.log("Connected to MongoDB");

app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use("/machine", machineRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const d = new Date();
console.log(d);
